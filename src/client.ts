import type {
  AgentIdentityParams,
  AgentIdentityResult,
  AgentParams,
  AgentsFilesGetParams,
  AgentsFilesGetResult,
  AgentsFilesListParams,
  AgentsFilesListResult,
  AgentsFilesSetParams,
  AgentsFilesSetResult,
  AgentsListParams,
  AgentsListResult,
  AgentWaitParams,
  ChannelsLogoutParams,
  ChannelsStatusParams,
  ChannelsStatusResult,
  ChatAbortParams,
  ChatHistoryParams,
  ChatInjectParams,
  ChatSendParams,
  ConfigApplyParams,
  ConfigGetParams,
  ConfigPatchParams,
  ConfigSchemaParams,
  ConfigSchemaResponse,
  ConfigSetParams,
  ConnectParams,
  CronAddParams,
  CronJob,
  CronListParams,
  CronRemoveParams,
  CronRunLogEntry,
  CronRunParams,
  CronRunsParams,
  CronStatusParams,
  CronUpdateParams,
  DevicePairApproveParams,
  DevicePairListParams,
  DevicePairRejectParams,
  DeviceTokenRevokeParams,
  DeviceTokenRotateParams,
  EventFrame,
  ExecApprovalRequestParams,
  ExecApprovalResolveParams,
  ExecApprovalsGetParams,
  ExecApprovalsNodeGetParams,
  ExecApprovalsNodeSetParams,
  ExecApprovalsSetParams,
  ExecApprovalsSnapshot,
  HelloOk,
  LogsTailParams,
  LogsTailResult,
  ModelsListParams,
  ModelsListResult,
  NodeDescribeParams,
  NodeInvokeParams,
  NodeListParams,
  NodePairApproveParams,
  NodePairListParams,
  NodePairRejectParams,
  NodePairRequestParams,
  NodePairVerifyParams,
  NodeRenameParams,
  PollParams,
  RequestFrame,
  ResponseFrame,
  SendParams,
  SessionsCompactParams,
  SessionsDeleteParams,
  SessionsListParams,
  SessionsPatchParams,
  SessionsPreviewParams,
  SessionsResetParams,
  SessionsResolveParams,
  SkillsBinsParams,
  SkillsBinsResult,
  SkillsInstallParams,
  SkillsStatusParams,
  SkillsUpdateParams,
  TalkModeParams,
  UpdateRunParams,
  WakeParams,
  WebLoginStartParams,
  WebLoginWaitParams,
  WizardCancelParams,
  WizardNextParams,
  WizardNextResult,
  WizardStartParams,
  WizardStartResult,
  WizardStatusParams,
  WizardStatusResult,
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
   * Apply configuration changes
   */
  async applyConfig(params: ConfigApplyParams): Promise<any> {
    return this.request('config.apply', params);
  }

  /**
   * Patch configuration
   */
  async patchConfig(params: ConfigPatchParams): Promise<any> {
    return this.request('config.patch', params);
  }

  /**
   * Preview sessions
   */
  async previewSessions(params: SessionsPreviewParams): Promise<any> {
    return this.request('sessions.preview', params);
  }

  /**
   * Resolve session
   */
  async resolveSession(params: SessionsResolveParams): Promise<any> {
    return this.request('sessions.resolve', params);
  }

  /**
   * Patch session
   */
  async patchSession(params: SessionsPatchParams): Promise<any> {
    return this.request('sessions.patch', params);
  }

  /**
   * Reset session
   */
  async resetSession(params: SessionsResetParams): Promise<any> {
    return this.request('sessions.reset', params);
  }

  /**
   * Compact session
   */
  async compactSession(params: SessionsCompactParams): Promise<any> {
    return this.request('sessions.compact', params);
  }

  /**
   * Send a message to agent
   */
  async sendToAgent(params: AgentParams): Promise<any> {
    return this.request('agent', params);
  }

  /**
   * Wait for agent run to complete
   */
  async waitForAgent(params: AgentWaitParams): Promise<any> {
    return this.request('agent.wait', params);
  }

  /**
   * Send a message
   */
  async send(params: SendParams): Promise<any> {
    return this.request('send', params);
  }

  /**
   * Send a poll
   */
  async poll(params: PollParams): Promise<any> {
    return this.request('poll', params);
  }

  /**
   * Wake the system
   */
  async wake(params: WakeParams): Promise<any> {
    return this.request('wake', params);
  }

  /**
   * Start wizard
   */
  async startWizard(params: WizardStartParams = {}): Promise<WizardStartResult> {
    return this.request<WizardStartResult>('wizard.start', params);
  }

  /**
   * Wizard next step
   */
  async wizardNext(params: WizardNextParams): Promise<WizardNextResult> {
    return this.request<WizardNextResult>('wizard.next', params);
  }

  /**
   * Cancel wizard
   */
  async cancelWizard(params: WizardCancelParams): Promise<any> {
    return this.request('wizard.cancel', params);
  }

  /**
   * Get wizard status
   */
  async getWizardStatus(params: WizardStatusParams): Promise<WizardStatusResult> {
    return this.request<WizardStatusResult>('wizard.status', params);
  }

  /**
   * Set talk mode
   */
  async setTalkMode(params: TalkModeParams): Promise<any> {
    return this.request('talk.mode', params);
  }

  /**
   * Get channels status
   */
  async getChannelsStatus(params: ChannelsStatusParams = {}): Promise<ChannelsStatusResult> {
    return this.request<ChannelsStatusResult>('channels.status', params);
  }

  /**
   * Logout from channel
   */
  async logoutChannel(params: ChannelsLogoutParams): Promise<any> {
    return this.request('channels.logout', params);
  }

  /**
   * Start web login
   */
  async startWebLogin(params: WebLoginStartParams = {}): Promise<any> {
    return this.request('weblogin.start', params);
  }

  /**
   * Wait for web login
   */
  async waitForWebLogin(params: WebLoginWaitParams = {}): Promise<any> {
    return this.request('weblogin.wait', params);
  }

  /**
   * Get skills status
   */
  async getSkillsStatus(params: SkillsStatusParams = {}): Promise<any> {
    return this.request('skills.status', params);
  }

  /**
   * Get skills bins
   */
  async getSkillsBins(params: SkillsBinsParams = {}): Promise<SkillsBinsResult> {
    return this.request<SkillsBinsResult>('skills.bins', params);
  }

  /**
   * Install skill
   */
  async installSkill(params: SkillsInstallParams): Promise<any> {
    return this.request('skills.install', params);
  }

  /**
   * Update skill
   */
  async updateSkill(params: SkillsUpdateParams): Promise<any> {
    return this.request('skills.update', params);
  }

  /**
   * List cron jobs
   */
  async listCronJobs(params: CronListParams = {}): Promise<{ jobs: CronJob[] }> {
    return this.request('cron.list', params);
  }

  /**
   * Get cron status
   */
  async getCronStatus(params: CronStatusParams = {}): Promise<any> {
    return this.request('cron.status', params);
  }

  /**
   * Add cron job
   */
  async addCronJob(params: CronAddParams): Promise<{ job: CronJob }> {
    return this.request('cron.add', params);
  }

  /**
   * Update cron job
   */
  async updateCronJob(params: CronUpdateParams): Promise<{ job: CronJob }> {
    return this.request('cron.update', params);
  }

  /**
   * Remove cron job
   */
  async removeCronJob(params: CronRemoveParams): Promise<any> {
    return this.request('cron.remove', params);
  }

  /**
   * Run cron job
   */
  async runCronJob(params: CronRunParams): Promise<any> {
    return this.request('cron.run', params);
  }

  /**
   * Get cron job runs
   */
  async getCronRuns(params: CronRunsParams): Promise<{ runs: CronRunLogEntry[] }> {
    return this.request('cron.runs', params);
  }

  /**
   * Get exec approvals
   */
  async getExecApprovals(params: ExecApprovalsGetParams = {}): Promise<ExecApprovalsSnapshot> {
    return this.request<ExecApprovalsSnapshot>('exec.approvals.get', params);
  }

  /**
   * Set exec approvals
   */
  async setExecApprovals(params: ExecApprovalsSetParams): Promise<ExecApprovalsSnapshot> {
    return this.request<ExecApprovalsSnapshot>('exec.approvals.set', params);
  }

  /**
   * Get node exec approvals
   */
  async getNodeExecApprovals(params: ExecApprovalsNodeGetParams): Promise<ExecApprovalsSnapshot> {
    return this.request<ExecApprovalsSnapshot>('exec.approvals.node.get', params);
  }

  /**
   * Set node exec approvals
   */
  async setNodeExecApprovals(params: ExecApprovalsNodeSetParams): Promise<ExecApprovalsSnapshot> {
    return this.request<ExecApprovalsSnapshot>('exec.approvals.node.set', params);
  }

  /**
   * Request exec approval
   */
  async requestExecApproval(params: ExecApprovalRequestParams): Promise<any> {
    return this.request('exec.approval.request', params);
  }

  /**
   * Resolve exec approval
   */
  async resolveExecApproval(params: ExecApprovalResolveParams): Promise<any> {
    return this.request('exec.approval.resolve', params);
  }

  /**
   * List device pairing requests
   */
  async listDevicePairings(params: DevicePairListParams = {}): Promise<any> {
    return this.request('device.pair.list', params);
  }

  /**
   * Approve device pairing
   */
  async approveDevicePairing(params: DevicePairApproveParams): Promise<any> {
    return this.request('device.pair.approve', params);
  }

  /**
   * Reject device pairing
   */
  async rejectDevicePairing(params: DevicePairRejectParams): Promise<any> {
    return this.request('device.pair.reject', params);
  }

  /**
   * Rotate device token
   */
  async rotateDeviceToken(params: DeviceTokenRotateParams): Promise<any> {
    return this.request('device.token.rotate', params);
  }

  /**
   * Revoke device token
   */
  async revokeDeviceToken(params: DeviceTokenRevokeParams): Promise<any> {
    return this.request('device.token.revoke', params);
  }

  /**
   * Get chat history
   */
  async getChatHistory(params: ChatHistoryParams): Promise<any> {
    return this.request('chat.history', params);
  }

  /**
   * Send chat message
   */
  async sendChat(params: ChatSendParams): Promise<any> {
    return this.request('chat.send', params);
  }

  /**
   * Abort chat
   */
  async abortChat(params: ChatAbortParams): Promise<any> {
    return this.request('chat.abort', params);
  }

  /**
   * Inject chat message
   */
  async injectChat(params: ChatInjectParams): Promise<any> {
    return this.request('chat.inject', params);
  }

  /**
   * Request node pairing
   */
  async requestNodePairing(params: NodePairRequestParams): Promise<any> {
    return this.request('node.pair.request', params);
  }

  /**
   * List node pairing requests
   */
  async listNodePairings(params: NodePairListParams = {}): Promise<any> {
    return this.request('node.pair.list', params);
  }

  /**
   * Approve node pairing
   */
  async approveNodePairing(params: NodePairApproveParams): Promise<any> {
    return this.request('node.pair.approve', params);
  }

  /**
   * Reject node pairing
   */
  async rejectNodePairing(params: NodePairRejectParams): Promise<any> {
    return this.request('node.pair.reject', params);
  }

  /**
   * Verify node pairing
   */
  async verifyNodePairing(params: NodePairVerifyParams): Promise<any> {
    return this.request('node.pair.verify', params);
  }

  /**
   * Rename node
   */
  async renameNode(params: NodeRenameParams): Promise<any> {
    return this.request('node.rename', params);
  }

  /**
   * List nodes
   */
  async listNodes(params: NodeListParams = {}): Promise<any> {
    return this.request('node.list', params);
  }

  /**
   * Describe node
   */
  async describeNode(params: NodeDescribeParams): Promise<any> {
    return this.request('node.describe', params);
  }

  /**
   * Invoke node command
   */
  async invokeNode(params: NodeInvokeParams): Promise<any> {
    return this.request('node.invoke', params);
  }

  /**
   * Update and run
   */
  async updateRun(params: UpdateRunParams): Promise<any> {
    return this.request('update.run', params);
  }

  /**
   * Generic call method for any RPC method
   * Use this for methods that don't have a dedicated wrapper
   */
  async call<T = any>(method: string, params?: any): Promise<T> {
    return this.request<T>(method, params);
  }
}
