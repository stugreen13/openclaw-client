import type {
  AgentIdentityParams,
  AgentIdentityResult,
  AgentsFilesGetParams,
  AgentsFilesGetResult,
  AgentsFilesListParams,
  AgentsFilesListResult,
  AgentsFilesSetParams,
  AgentsFilesSetResult,
  AgentsListParams,
  AgentsListResult,
  ConfigGetParams,
  ConfigSchemaParams,
  ConfigSchemaResponse,
  ConfigSetParams,
  ConnectParams,
  EventFrame,
  HelloOk,
  LogsTailParams,
  LogsTailResult,
  ModelsListParams,
  ModelsListResult,
  RequestFrame,
  ResponseFrame,
  SessionsDeleteParams,
  SessionsListParams,
} from './types';

export interface OpenClawClientConfig {
  gatewayUrl: string;
  token: string;
  clientId?: ConnectParams['client']['id'];
  clientVersion?: string;
  platform?: string;
  mode?: ConnectParams['client']['mode'];
}

export type EventListener = (event: EventFrame) => void;

// Get WebSocket constructor (works in both browser and Node.js 21+)
const getWebSocketConstructor = (): typeof WebSocket => {
  if (typeof WebSocket !== 'undefined') {
    return WebSocket;
  }
  throw new Error('WebSocket is not available in this environment');
};

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private config: OpenClawClientConfig;
  private requestId = 0;
  private pending = new Map<
    string,
    {
      resolve: (payload: any) => void;
      reject: (error: any) => void;
    }
  >();
  private eventListeners: EventListener[] = [];
  private connected = false;
  private connectionId: string | null = null;

  constructor(config: OpenClawClientConfig) {
    this.config = config;
  }

  /**
   * Connect to the OpenClaw Gateway and perform handshake
   */
  async connect(): Promise<HelloOk> {
    if (this.connected && this.ws?.readyState === WebSocket.OPEN) {
      throw new Error('Already connected');
    }

    // Create WebSocket connection
    const WS = getWebSocketConstructor();
    this.ws = new WS(this.config.gatewayUrl);

    // Wait for connection to open
    await new Promise<void>((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('WebSocket not initialized'));
        return;
      }

      this.ws.onopen = () => resolve();
      this.ws.onerror = (error) => reject(error);
    });

    // Set up message handler
    if (this.ws) {
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = () => this.handleClose();
      this.ws.onerror = (error) => this.handleError(error);
    }

    // Perform handshake
    const result = await this.handshake();
    this.connected = true;
    this.connectionId = result.server.connId;
    return result;
  }

  /**
   * Disconnect from the Gateway
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.connectionId = null;

    // Reject all pending requests
    for (const [id, { reject }] of this.pending.entries()) {
      reject(new Error('Connection closed'));
      this.pending.delete(id);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get the current connection ID
   */
  getConnectionId(): string | null {
    return this.connectionId;
  }

  /**
   * Add an event listener
   */
  addEventListener(listener: EventListener): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  /**
   * Perform the connection handshake
   */
  private async handshake(): Promise<HelloOk> {
    const params: ConnectParams = {
      minProtocol: 3,
      maxProtocol: 3,
      client: {
        id: this.config.clientId || 'webchat-ui',
        version: this.config.clientVersion || '1.0.0',
        platform: this.config.platform || 'web',
        mode: this.config.mode || 'ui',
      },
      role: 'operator',
      scopes: ['operator.read', 'operator.write', 'operator.admin'],
      auth: {
        token: this.config.token,
      },
    };

    return this.request<HelloOk>('connect', params);
  }

  /**
   * Send a request and wait for response
   */
  private async request<T = any>(method: string, params?: any): Promise<T> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected');
    }

    const id = `req-${++this.requestId}`;
    const req: RequestFrame = {
      type: 'req',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });

      // Set timeout for request (30 seconds)
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, 30000);

      // Clear timeout when promise settles
      const originalResolve = resolve;
      const originalReject = reject;

      this.pending.set(id, {
        resolve: (payload) => {
          clearTimeout(timeout);
          originalResolve(payload);
        },
        reject: (error) => {
          clearTimeout(timeout);
          originalReject(error);
        },
      });

      this.ws!.send(JSON.stringify(req));
    });
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const frame = JSON.parse(event.data);

      if (frame.type === 'res') {
        this.handleResponse(frame as ResponseFrame);
      } else if (frame.type === 'event') {
        this.handleEvent(frame as EventFrame);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * Handle response frame
   */
  private handleResponse(frame: ResponseFrame): void {
    const pending = this.pending.get(frame.id);
    if (!pending) {
      console.warn('Received response for unknown request:', frame.id);
      return;
    }

    this.pending.delete(frame.id);

    if (frame.ok) {
      pending.resolve(frame.payload);
    } else {
      const error = new Error(frame.error?.message || 'Request failed');
      (error as any).code = frame.error?.code;
      (error as any).details = frame.error?.details;
      (error as any).retryable = frame.error?.retryable;
      pending.reject(error);
    }
  }

  /**
   * Handle event frame
   */
  private handleEvent(frame: EventFrame): void {
    for (const listener of this.eventListeners) {
      try {
        listener(frame);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    }
  }

  /**
   * Handle connection close
   */
  private handleClose(): void {
    this.connected = false;
    console.log('WebSocket connection closed');
  }

  /**
   * Handle connection error
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
  }

  // ============================================================================
  // Type-safe method wrappers based on schema
  // ============================================================================

  /**
   * Get the current configuration
   */
  async getConfig(params: ConfigGetParams = {}): Promise<any> {
    return this.request('config.get', params);
  }

  /**
   * Set configuration
   */
  async setConfig(params: ConfigSetParams): Promise<any> {
    return this.request('config.set', params);
  }

  /**
   * Get configuration schema
   */
  async getConfigSchema(params: ConfigSchemaParams = {}): Promise<ConfigSchemaResponse> {
    return this.request<ConfigSchemaResponse>('config.schema', params);
  }

  /**
   * List sessions
   */
  async listSessions(params: SessionsListParams = {}): Promise<any> {
    return this.request('sessions.list', params);
  }

  /**
   * Delete a session
   */
  async deleteSession(params: SessionsDeleteParams): Promise<any> {
    return this.request('sessions.delete', params);
  }

  /**
   * Get agent file
   */
  async getAgentFile(params: AgentsFilesGetParams): Promise<AgentsFilesGetResult> {
    return this.request<AgentsFilesGetResult>('agents.files.get', params);
  }

  /**
   * List agent files
   */
  async listAgentFiles(params: AgentsFilesListParams): Promise<AgentsFilesListResult> {
    return this.request<AgentsFilesListResult>('agents.files.list', params);
  }

  /**
   * Set agent file content
   */
  async setAgentFile(params: AgentsFilesSetParams): Promise<AgentsFilesSetResult> {
    return this.request<AgentsFilesSetResult>('agents.files.set', params);
  }

  /**
   * List available agents
   */
  async listAgents(params: AgentsListParams = {}): Promise<AgentsListResult> {
    return this.request<AgentsListResult>('agents.list', params);
  }

  /**
   * Get agent identity
   */
  async getAgentIdentity(params: AgentIdentityParams = {}): Promise<AgentIdentityResult> {
    return this.request<AgentIdentityResult>('agent.identity', params);
  }

  /**
   * List available models
   */
  async listModels(params: ModelsListParams = {}): Promise<ModelsListResult> {
    return this.request<ModelsListResult>('models.list', params);
  }

  /**
   * Get log tail
   */
  async getLogTail(params: LogsTailParams = {}): Promise<LogsTailResult> {
    return this.request<LogsTailResult>('logs.tail', params);
  }

  /**
   * Generic call method for any RPC method
   * Use this for methods that don't have a dedicated wrapper
   */
  async call<T = any>(method: string, params?: any): Promise<T> {
    return this.request<T>(method, params);
  }
}
