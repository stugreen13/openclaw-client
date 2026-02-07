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

**Connection Management**
- `connect(): Promise<HelloOk>` - Connect and authenticate
- `disconnect(): void` - Disconnect from Gateway
- `isConnected(): boolean` - Check connection status
- `getConnectionId(): string | null` - Get the current connection ID
- `addEventListener(listener): () => void` - Add event listener

**Configuration**
- `getConfig(params?): Promise<any>` - Get configuration
- `setConfig(params): Promise<any>` - Update configuration
- `getConfigSchema(params?): Promise<ConfigSchemaResponse>` - Get configuration schema
- `applyConfig(params): Promise<any>` - Apply configuration changes
- `patchConfig(params): Promise<any>` - Patch configuration

**Sessions**
- `listSessions(params?): Promise<any>` - List sessions
- `deleteSession(params): Promise<any>` - Delete a session
- `previewSessions(params): Promise<any>` - Preview sessions
- `resolveSession(params): Promise<any>` - Resolve session
- `patchSession(params): Promise<any>` - Patch session
- `resetSession(params): Promise<any>` - Reset session
- `compactSession(params): Promise<any>` - Compact session

**Agents**
- `listAgents(params?): Promise<AgentsListResult>` - List available agents
- `getAgentIdentity(params?): Promise<AgentIdentityResult>` - Get agent identity
- `sendToAgent(params): Promise<any>` - Send a message to agent
- `waitForAgent(params): Promise<any>` - Wait for agent run to complete

**Agent Files**
- `getAgentFile(params): Promise<AgentsFilesGetResult>` - Get agent file
- `listAgentFiles(params): Promise<AgentsFilesListResult>` - List agent files
- `setAgentFile(params): Promise<AgentsFilesSetResult>` - Update agent file

**Models**
- `listModels(params?): Promise<ModelsListResult>` - List available models

**Messaging**
- `send(params): Promise<any>` - Send a message
- `poll(params): Promise<any>` - Send a poll
- `wake(params): Promise<any>` - Wake the system

**Chat**
- `getChatHistory(params): Promise<any>` - Get chat history
- `sendChat(params): Promise<any>` - Send chat message
- `abortChat(params): Promise<any>` - Abort chat
- `injectChat(params): Promise<any>` - Inject chat message

**Wizard**
- `startWizard(params?): Promise<WizardStartResult>` - Start wizard
- `wizardNext(params): Promise<WizardNextResult>` - Wizard next step
- `cancelWizard(params): Promise<any>` - Cancel wizard
- `getWizardStatus(params): Promise<WizardStatusResult>` - Get wizard status

**Channels**
- `getChannelsStatus(params?): Promise<ChannelsStatusResult>` - Get channels status
- `logoutChannel(params): Promise<any>` - Logout from channel
- `setTalkMode(params): Promise<any>` - Set talk mode

**Authentication**
- `startWebLogin(params?): Promise<any>` - Start web login
- `waitForWebLogin(params?): Promise<any>` - Wait for web login

**Skills**
- `getSkillsStatus(params?): Promise<any>` - Get skills status
- `getSkillsBins(params?): Promise<SkillsBinsResult>` - Get skills bins
- `installSkill(params): Promise<any>` - Install skill
- `updateSkill(params): Promise<any>` - Update skill

**Cron Jobs**
- `listCronJobs(params?): Promise<{ jobs: CronJob[] }>` - List cron jobs
- `getCronStatus(params?): Promise<any>` - Get cron status
- `addCronJob(params): Promise<{ job: CronJob }>` - Add cron job
- `updateCronJob(params): Promise<{ job: CronJob }>` - Update cron job
- `removeCronJob(params): Promise<any>` - Remove cron job
- `runCronJob(params): Promise<any>` - Run cron job
- `getCronRuns(params): Promise<{ runs: CronRunLogEntry[] }>` - Get cron job runs

**Execution Approvals**
- `getExecApprovals(params?): Promise<ExecApprovalsSnapshot>` - Get exec approvals
- `setExecApprovals(params): Promise<ExecApprovalsSnapshot>` - Set exec approvals
- `getNodeExecApprovals(params): Promise<ExecApprovalsSnapshot>` - Get node exec approvals
- `setNodeExecApprovals(params): Promise<ExecApprovalsSnapshot>` - Set node exec approvals
- `requestExecApproval(params): Promise<any>` - Request exec approval
- `resolveExecApproval(params): Promise<any>` - Resolve exec approval

**Device Pairing**
- `listDevicePairings(params?): Promise<any>` - List device pairing requests
- `approveDevicePairing(params): Promise<any>` - Approve device pairing
- `rejectDevicePairing(params): Promise<any>` - Reject device pairing
- `rotateDeviceToken(params): Promise<any>` - Rotate device token
- `revokeDeviceToken(params): Promise<any>` - Revoke device token

**Node Management**
- `requestNodePairing(params): Promise<any>` - Request node pairing
- `listNodePairings(params?): Promise<any>` - List node pairing requests
- `approveNodePairing(params): Promise<any>` - Approve node pairing
- `rejectNodePairing(params): Promise<any>` - Reject node pairing
- `verifyNodePairing(params): Promise<any>` - Verify node pairing
- `renameNode(params): Promise<any>` - Rename node
- `listNodes(params?): Promise<any>` - List nodes
- `describeNode(params): Promise<any>` - Describe node
- `invokeNode(params): Promise<any>` - Invoke node command

**Logs**
- `getLogTail(params?): Promise<LogsTailResult>` - Get log tail

**Updates**
- `updateRun(params): Promise<any>` - Update and run

**Generic**
- `call<T>(method, params?): Promise<T>` - Generic RPC method call for any method

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
