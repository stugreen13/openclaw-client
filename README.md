# openclaw-client

Lightweight TypeScript client for OpenClaw Gateway WebSocket RPC.

## Installation

```bash
npm install openclaw-client
# or
pnpm add openclaw-client
# or
yarn add openclaw-client
```

## Quick Start

```typescript
import { OpenClawClient } from 'openclaw-client';

const client = new OpenClawClient({
  gatewayUrl: 'ws://localhost:18789',
  token: 'your-token',
  clientId: 'gateway-client',
  mode: 'ui',
});

await client.connect();
const sessions = await client.listSessions();
```

## Features

- ✅ **Type-safe** - Auto-generated TypeScript types from OpenClaw protocol schema
- ✅ **Lightweight** - Minimal dependencies, works in Node.js 18+ and browsers
- ✅ **Event handling** - Listen to real-time events from the Gateway
- ✅ **Server-friendly** - Includes utilities for server-side usage (Next.js, etc.)

## API

### `OpenClawClient`

Main WebSocket client for OpenClaw Gateway.

#### Configuration

```typescript
interface OpenClawClientConfig {
  gatewayUrl: string;        // WebSocket URL (ws:// or wss://)
  token: string;             // Authentication token
  clientId?: string;         // Client identifier (default: 'webchat-ui')
  clientVersion?: string;    // Client version (default: '1.0.0')
  platform?: string;         // Platform name (default: 'web')
  mode?: string;             // Client mode (default: 'ui')
}
```

#### Methods

- `connect(): Promise<HelloOk>` - Connect and authenticate
- `disconnect(): void` - Disconnect from Gateway
- `isConnected(): boolean` - Check connection status
- `addEventListener(listener): () => void` - Add event listener
- `getConfig(params?): Promise<any>` - Get configuration
- `setConfig(params): Promise<any>` - Update configuration
- `listSessions(params?): Promise<any>` - List sessions
- `deleteSession(params): Promise<any>` - Delete a session
- `listAgents(params?): Promise<AgentsListResult>` - List agents
- `getAgentFile(params): Promise<AgentsFilesGetResult>` - Get agent file
- `listAgentFiles(params): Promise<AgentsFilesListResult>` - List agent files
- `setAgentFile(params): Promise<AgentsFilesSetResult>` - Update agent file
- `listModels(params?): Promise<ModelsListResult>` - List available models
- `getLogTail(params?): Promise<LogsTailResult>` - Get log tail
- `call<T>(method, params?): Promise<T>` - Generic RPC method call

### `ServerOpenClawClient`

Server-side client manager for connection lifecycle management.

```typescript
import { ServerOpenClawClient, createServerClient } from 'openclaw-client';

// Create from environment variables
const serverClient = createServerClient();

// Use with automatic connection management
export async function myAction() {
  return serverClient.withClient(async (client) => {
    return await client.listSessions();
  });
}
```

Environment variables:
- `OPENCLAW_GATEWAY_URL` - Gateway URL (default: `http://localhost:18789`)
- `OPENCLAW_TOKEN` - Authentication token

## Type Generation

This package includes auto-generated types from the OpenClaw protocol schema.

To regenerate types (for development):

```bash
npm run generate:types
```

The schema file is located at `src/protocol.schema.json` and is manually updated when the OpenClaw protocol changes.

## Development

```bash
# Install dependencies
npm install

# Generate types from schema
npm run generate:types

# Build the package
npm run build

# Publish to npm
npm publish
```

## License

MIT
