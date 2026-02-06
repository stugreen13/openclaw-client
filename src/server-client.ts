import { OpenClawClient, type OpenClawClientConfig } from './client';

/**
 * Server-side OpenClaw client manager
 * Handles connection lifecycle for server actions
 */
export class ServerOpenClawClient {
  private config: OpenClawClientConfig;
  private client: OpenClawClient | null = null;

  constructor(config: OpenClawClientConfig) {
    this.config = config;
  }

  /**
   * Execute a function with a connected client
   * Automatically handles connection and disconnection
   */
  async withClient<T>(fn: (client: OpenClawClient) => Promise<T>): Promise<T> {
    const client = new OpenClawClient(this.config);

    try {
      await client.connect();
      return await fn(client);
    } finally {
      client.disconnect();
    }
  }

  /**
   * Get or create a persistent client connection
   * Note: Use with caution in serverless environments
   */
  async getClient(): Promise<OpenClawClient> {
    if (!this.client || !this.client.isConnected()) {
      this.client = new OpenClawClient(this.config);
      await this.client.connect();
    }
    return this.client;
  }

  /**
   * Disconnect the persistent client
   */
  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}

/**
 * Create a server OpenClaw client from environment variables
 */
export function createServerClient(): ServerOpenClawClient {
  // Convert HTTP URL to WebSocket URL
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
  const wsUrl = gatewayUrl.replace(/^http/, 'ws');

  return new ServerOpenClawClient({
    gatewayUrl: wsUrl,
    token: process.env.OPENCLAW_TOKEN || '',
    clientId: 'gateway-client',
    clientVersion: '1.0.0',
    platform: 'web',
    mode: 'ui',
  });
}
