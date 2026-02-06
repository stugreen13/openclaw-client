# openclaw-client

[![npm version](https://badge.fury.io/js/openclaw-client.svg)](https://www.npmjs.com/package/openclaw-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript/JavaScript client library for connecting to OpenClaw Gateway via WebSocket.

## Features

- 🔌 **WebSocket-based** - Real-time bidirectional communication
- 📘 **Fully typed** - Complete TypeScript definitions for all protocol methods
- 🪶 **Zero dependencies** - Uses native WebSocket (works in browsers and Node.js 18+)
- 🌐 **Universal** - Works in browsers, Node.js, and serverless environments
- ⚡ **Simple API** - Easy-to-use client with type-safe method wrappers
- 🔄 **Event handling** - Built-in event listener system for server-sent events

## Installation

```bash
npm install openclaw-client
```

```bash
pnpm add openclaw-client
```

```bash
yarn add openclaw-client
```

## Quick Start

### Browser / Client-side Usage

```typescript
import { OpenClawClient } from 'openclaw-client';

const client = new OpenClawClient({
  gatewayUrl: 'ws://localhost:18789',
  token: 'your-auth-token',
  clientId: 'webchat-ui',
  clientVersion: '1.0.0',
  platform: 'web',
  mode: 'ui',
});

// Connect to the gateway
await client.connect();

// List available agents
const agents = await client.listAgents();
console.log('Available agents:', agents);

// Listen for events
client.addEventListener((event) => {
  console.log('Received event:', event);
});

// Disconnect when done
client.disconnect();
```

### Server-side Usage (Node.js)

For server-side environments, use the `ServerOpenClawClient` which handles connection lifecycle:

```typescript
import { createServerClient } from 'openclaw-client';

// Create client from environment variables
const serverClient = createServerClient();

// Execute operations with automatic connection management
const result = await serverClient.withClient(async (client) => {
  const agents = await client.listAgents();
  const config = await client.getConfig();
  return { agents, config };
});

console.log('Result:', result);
```

You can also set environment variables:

```bash
OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_TOKEN=your-auth-token
```

Or create a server client with custom configuration:

```typescript
import { ServerOpenClawClient } from 'openclaw-client';

const serverClient = new ServerOpenClawClient({
  gatewayUrl: 'ws://your-gateway.com',
  token: 'your-token',
  clientId: 'gateway-client',
  clientVersion: '1.0.0',
  platform: 'node',
  mode: 'backend',
});

await serverClient.withClient(async (client) => {
  // Your operations here
});
```

## API Reference

### OpenClawClient

The main client class for connecting to OpenClaw Gateway.

#### Constructor

```typescript
new OpenClawClient(config: OpenClawClientConfig)
```

**Config Options:**

- `gatewayUrl` (string) - WebSocket URL of the gateway (e.g., `ws://localhost:18789`)
- `token` (string) - Authentication token
- `clientId` (optional) - Client identifier (default: `'webchat-ui'`)
- `clientVersion` (optional) - Client version (default: `'1.0.0'`)
- `platform` (optional) - Platform identifier (default: `'web'`)
- `mode` (optional) - Client mode: `'ui'`, `'cli'`, `'backend'`, etc. (default: `'ui'`)

#### Methods

##### Connection Management

- `connect(): Promise<HelloOk>` - Connect to the gateway and perform handshake
- `disconnect(): void` - Disconnect from the gateway
- `isConnected(): boolean` - Check if currently connected
- `getConnectionId(): string | null` - Get the current connection ID

##### Event Handling

- `addEventListener(listener: EventListener): () => void` - Add an event listener. Returns a function to remove the listener.

##### Configuration

- `getConfig(params?): Promise<any>` - Get current configuration
- `setConfig(params): Promise<any>` - Set configuration
- `getConfigSchema(params?): Promise<ConfigSchemaResponse>` - Get configuration schema

##### Sessions

- `listSessions(params?): Promise<any>` - List all sessions
- `deleteSession(params): Promise<any>` - Delete a specific session

##### Agents

- `listAgents(params?): Promise<AgentsListResult>` - List available agents
- `getAgentIdentity(params?): Promise<AgentIdentityResult>` - Get agent identity
- `listAgentFiles(params): Promise<AgentsFilesListResult>` - List agent files
- `getAgentFile(params): Promise<AgentsFilesGetResult>` - Get agent file content
- `setAgentFile(params): Promise<AgentsFilesSetResult>` - Set agent file content

##### Models

- `listModels(params?): Promise<ModelsListResult>` - List available models

##### Logs

- `getLogTail(params?): Promise<LogsTailResult>` - Get log tail

##### Generic RPC

- `call<T>(method: string, params?): Promise<T>` - Call any RPC method directly

### ServerOpenClawClient

Server-side client manager that handles connection lifecycle automatically.

#### Methods

- `withClient<T>(fn: (client: OpenClawClient) => Promise<T>): Promise<T>` - Execute a function with an auto-managed connection
- `getClient(): Promise<OpenClawClient>` - Get or create a persistent client (use with caution in serverless)
- `disconnect(): void` - Disconnect the persistent client

#### Helper Function

- `createServerClient(): ServerOpenClawClient` - Create a server client from environment variables

## Type Definitions

All protocol types are exported and fully documented:

```typescript
import type {
  ConnectParams,
  HelloOk,
  AgentsListResult,
  ConfigSchemaResponse,
  EventFrame,
  // ... and many more
} from 'openclaw-client';
```

## Examples

### Listening to Events

```typescript
const client = new OpenClawClient({ /* config */ });
await client.connect();

const removeListener = client.addEventListener((event) => {
  if (event.event === 'agent.event') {
    console.log('Agent event:', event.payload);
  }
});

// Later: remove the listener
removeListener();
```

### Using Multiple Agents

```typescript
const client = new OpenClawClient({ /* config */ });
await client.connect();

// List all agents
const { agents } = await client.listAgents();

// Get specific agent identity
const identity = await client.getAgentIdentity({ agentId: agents[0].id });
console.log('Agent identity:', identity);

// List agent files
const files = await client.listAgentFiles({ agentId: agents[0].id });
console.log('Agent files:', files);
```

### Server-Side Request Handler

```typescript
import { createServerClient } from 'openclaw-client';

const serverClient = createServerClient();

export async function GET(request: Request) {
  try {
    const data = await serverClient.withClient(async (client) => {
      const [agents, models, config] = await Promise.all([
        client.listAgents(),
        client.listModels(),
        client.getConfig(),
      ]);

      return { agents, models, config };
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## Environment Support

- **Browsers** - All modern browsers with WebSocket support
- **Node.js** - Version 18+ (native WebSocket support)
- **Serverless** - Works in Edge runtimes, Cloudflare Workers, etc.

## Error Handling

The client throws errors for:
- Connection failures
- Request timeouts (30 seconds by default)
- Invalid responses from the server

```typescript
try {
  await client.connect();
} catch (error) {
  console.error('Connection failed:', error);
}

try {
  const result = await client.listAgents();
} catch (error) {
  console.error('Request failed:', error);
  // Check for specific error codes
  if (error.code === 'UNAUTHORIZED') {
    // Handle auth error
  }
}
```

## Protocol Type Updates

This package includes TypeScript types generated from the OpenClaw Gateway protocol schema. To update to the latest protocol:

1. Get the latest schema from [OpenClaw releases](https://github.com/openclaw/openclaw/releases)
2. Replace `protocol.schema.json` in the repo root
3. Run `pnpm generate:types` to regenerate TypeScript types
4. See [UPDATING.md](UPDATING.md) for detailed instructions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [openclaw-client contributors](LICENSE)

## Links

- [GitHub Repository](https://github.com/sbgreen/openclaw-client)
- [npm Package](https://www.npmjs.com/package/openclaw-client)
- [Issue Tracker](https://github.com/sbgreen/openclaw-client/issues)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/sbgreen/openclaw-client/issues) on GitHub.
