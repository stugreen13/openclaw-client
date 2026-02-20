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
  connectTimeoutMs?: number; // Timeout for connect handshake (default: 120000)
  requestTimeoutMs?: number; // Timeout for RPC requests (default: 30000)
  connectParams?: Partial<ConnectParams>  // Static object, or...
    | ((challenge: { nonce: string; ts: number }) =>  // ...function receiving challenge
        Partial<ConnectParams> | Promise<Partial<ConnectParams>>);
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
- `getSessionsUsage(params?): Promise<any>` - Get session usage

**Agents**
- `listAgents(params?): Promise<AgentsListResult>` - List available agents
- `createAgent(params): Promise<AgentsCreateResult>` - Create agent
- `updateAgent(params): Promise<AgentsUpdateResult>` - Update agent
- `deleteAgent(params): Promise<AgentsDeleteResult>` - Delete agent
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

**Channels & Talk**
- `getChannelsStatus(params?): Promise<ChannelsStatusResult>` - Get channels status
- `logoutChannel(params): Promise<any>` - Logout from channel
- `setTalkMode(params): Promise<any>` - Set talk mode
- `getTalkConfig(params?): Promise<TalkConfigResult>` - Get talk config

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
- `removeDevicePairing(params): Promise<any>` - Remove paired device
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
- `testPush(params): Promise<PushTestResult>` - Test push notification to node

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

## Type Generation & Client Wrapper Maintenance

This package uses a deterministic process to keep types and client method wrappers in sync with the OpenClaw protocol schema.

### Step 1: Update the schema

Place the latest `protocol.schema.json` from the OpenClaw Gateway into `src/protocol.schema.json`.

### Step 2: Regenerate types

```bash
npm run generate:types
```

This runs `src/generate-openclaw-types.ts` which uses `json-schema-to-typescript` to compile every definition in the schema into TypeScript interfaces. The output is written to `src/types.ts` (auto-generated, do not edit manually).

### Step 3: Update client method wrappers

The method wrappers in `src/client.ts` follow a deterministic pattern derived from the type names in `src/types.ts`:

1. **Find all `*Params` types** - Each `*Params` interface represents an RPC method.
2. **Derive the method name** - Convert the type name to a dot-separated RPC method name:
   - `ConfigGetParams` → `config.get`
   - `SessionsListParams` → `sessions.list`
   - `AgentsFilesGetParams` → `agents.files.get`
   - `ExecApprovalsNodeSetParams` → `exec.approvals.node.set`
   - Top-level methods like `SendParams`, `PollParams`, `WakeParams` → `send`, `poll`, `wake`
3. **Match result types** - If a corresponding `*Result` type exists (e.g. `AgentsListResult` for `AgentsListParams`), use it as the return type. Otherwise use `Promise<any>`.
4. **Choose a wrapper method name** - Use a readable camelCase name (e.g. `listSessions`, `getConfig`, `deleteAgent`).
5. **Default empty params** - If the `*Params` interface has no required fields (e.g. `interface ConfigGetParams {}`), default the parameter to `= {}`.
6. **Import and add** - Import the new Params/Result types at the top of `client.ts` and add the wrapper method.

**Skipped types:** Some `*Params` types are not RPC request methods but are used for node-side responses or event payloads (e.g. `NodeInvokeResultParams`, `NodeEventParams`). These are skipped.

### Full update workflow

```bash
# 1. Drop in updated schema
cp /path/to/new/protocol.schema.json src/protocol.schema.json

# 2. Regenerate types
npm run generate:types

# 3. Update client wrappers (compare types.ts *Params exports against client.ts imports)
#    - Add imports for any new *Params/*Result types
#    - Add wrapper methods following the pattern above
#    - Verify no existing types were removed/renamed

# 4. Build and verify
npm run build

# 5. Publish
npm publish
```

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

## Changelog

### 2.0.1

**Bug Fixes**

- **Challenge nonce now passed to `connectParams`** - The challenge received during the connect handshake was being ignored (`_challenge`). `connectParams` can now be a function that receives the challenge `{ nonce, ts }`, allowing callers to sign the nonce into `device.nonce`. Static objects still work as before (backwards compatible).

### 2.0.0

**Breaking Changes**

- **Connect handshake protocol** - The client now implements a challenge-response handshake. On connect, the gateway sends a `connect.challenge` event with a nonce before the client sends its `connect` request. This requires a compatible gateway version.

**New Features**

- **Configurable timeouts** - New `connectTimeoutMs` (default 120s) and `requestTimeoutMs` (default 30s) config options.
- **Connect params override** - New `connectParams` config option to merge additional fields into the handshake request (e.g. `device`, `caps`, `commands`).
- **New API methods:**
  - `createAgent` / `updateAgent` / `deleteAgent` - Full agent CRUD
  - `getSessionsUsage` - Session usage stats
  - `getTalkConfig` - Talk configuration
  - `removeDevicePairing` - Remove a paired device
  - `testPush` - Test push notifications to a node

### 1.1.1

- Documentation updates.

### 1.1.0

- Initial public release with full Gateway RPC coverage.

## License

MIT
