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

Connect to a local OpenClaw instance:

```typescript
import { OpenClawClient } from 'openclaw-client';

const client = new OpenClawClient({
  gatewayUrl: 'ws://localhost:18789',
  token: 'your-token',
});

const result = await client.connect();
console.log('Connected:', result.server.connId);

const sessions = await client.listSessions();
client.disconnect();
```

## Device Identity

Built-in Ed25519 device signing — no manual crypto required. Provide a `DeviceIdentityStore` (and optionally a `DeviceTokenStore`) and the library handles keypair generation, persistence, v2 payload signing, and device token management.

> **Requires Node.js 20+** or Chrome 113+ / Safari 17+ / Firefox 130+ (Ed25519 via Web Crypto API). The library itself still works on Node 18+ when device identity is not used.

### Browser Example

```typescript
import { OpenClawClient } from 'openclaw-client';
import type { DeviceIdentityRecord, DeviceIdentityStore, DeviceTokenStore } from 'openclaw-client';

const identityStore: DeviceIdentityStore = {
  async load() {
    const raw = localStorage.getItem('oc-device-identity');
    return raw ? JSON.parse(raw) : null;
  },
  async save(record: DeviceIdentityRecord) {
    localStorage.setItem('oc-device-identity', JSON.stringify(record));
  },
};

const tokenStore: DeviceTokenStore = {
  async load() {
    return localStorage.getItem('oc-device-token');
  },
  async save(token: string) {
    localStorage.setItem('oc-device-token', token);
  },
};

const client = new OpenClawClient({
  gatewayUrl: 'wss://gateway.example.com',
  token: 'initial-pairing-token',
  deviceIdentity: identityStore,
  deviceToken: tokenStore,
  onPairingRequired: (required) => {
    if (required) console.log('Approve this device on the gateway...');
    else console.log('Device paired!');
  },
});

await client.connect();
```

### Node.js Example

```typescript
import { readFile, writeFile } from 'fs/promises';
import { OpenClawClient } from 'openclaw-client';
import type { DeviceIdentityStore, DeviceTokenStore } from 'openclaw-client';

const identityStore: DeviceIdentityStore = {
  async load() {
    try { return JSON.parse(await readFile('.oc-identity.json', 'utf8')); }
    catch { return null; }
  },
  async save(record) {
    await writeFile('.oc-identity.json', JSON.stringify(record));
  },
};

const tokenStore: DeviceTokenStore = {
  async load() {
    try { return await readFile('.oc-token', 'utf8'); }
    catch { return null; }
  },
  async save(token) {
    await writeFile('.oc-token', token);
  },
};

const client = new OpenClawClient({
  gatewayUrl: 'ws://localhost:18789',
  token: 'your-token',
  deviceIdentity: identityStore,
  deviceToken: tokenStore,
});

await client.connect();
```

### Interaction with `connectParams`

| `deviceIdentity` | `connectParams` | Behavior |
|---|---|---|
| set | static object | Both work — device from manager, other fields (e.g. `caps`) merged from static object |
| set | function | `deviceIdentity` takes precedence — function is **not** called |
| not set | function | Existing behavior — function receives challenge, returns params |
| not set | static/absent | Simple merge, no device logic |

## Auto-Reconnection

Opt-in exponential backoff reconnection:

```typescript
const client = new OpenClawClient({
  gatewayUrl: 'wss://gateway.example.com',
  token: 'your-token',
  reconnect: {
    enabled: true,
    baseDelay: 1000,    // default 1s
    maxDelay: 30000,    // default 30s
    maxAttempts: 20,    // default Infinity
  },
  onConnection: (connected) => {
    console.log(connected ? 'Connected' : 'Disconnected');
  },
});

await client.connect();
// If connection drops, client will automatically reconnect
// Calling client.disconnect() stops reconnection
```

## Configuration Reference

```typescript
interface OpenClawClientConfig {
  gatewayUrl: string;        // WebSocket URL (ws:// or wss://)
  token: string;             // Authentication token
  clientId?: string;         // Client identifier (default: 'webchat-ui')
  clientVersion?: string;    // Client version (default: '1.0.0')
  platform?: string;         // Platform name (default: 'web')
  mode?: string;             // Client mode (default: 'ui')
  connectTimeoutMs?: number; // Handshake timeout in ms (default: 120000)
  requestTimeoutMs?: number; // RPC request timeout in ms (default: 30000)
  connectParams?: Partial<ConnectParams>  // Static connect params, or...
    | ((challenge: { nonce: string; ts: number }) =>  // ...function receiving challenge
        Partial<ConnectParams> | Promise<Partial<ConnectParams>>);
  deviceIdentity?: DeviceIdentityStore;   // Enable built-in device signing
  deviceToken?: DeviceTokenStore;         // Persist device tokens
  reconnect?: ReconnectConfig;            // Auto-reconnection settings
  onConnection?: (connected: boolean) => void;        // Connection state callback
  onPairingRequired?: (required: boolean) => void;    // Device pairing callback
}
```

## API Methods

### Connection

| Method | Returns | Description |
|---|---|---|
| `connect()` | `Promise<HelloOk>` | Connect and authenticate |
| `disconnect()` | `void` | Disconnect (stops auto-reconnect) |
| `isConnected()` | `boolean` | Check connection status |
| `getConnectionId()` | `string \| null` | Current connection ID |
| `addEventListener(listener)` | `() => void` | Add event listener (returns unsubscribe fn) |

### Configuration

| Method | Description |
|---|---|
| `getConfig(params?)` | Get configuration |
| `setConfig(params)` | Set configuration |
| `getConfigSchema(params?)` | Get configuration schema |
| `applyConfig(params)` | Apply configuration changes |
| `patchConfig(params)` | Patch configuration |

### Sessions

| Method | Description |
|---|---|
| `listSessions(params?)` | List sessions |
| `deleteSession(params)` | Delete a session |
| `previewSessions(params)` | Preview sessions |
| `resolveSession(params)` | Resolve session |
| `patchSession(params)` | Patch session |
| `resetSession(params)` | Reset session |
| `compactSession(params)` | Compact session |
| `getSessionsUsage(params?)` | Get session usage |

### Agents

| Method | Description |
|---|---|
| `listAgents(params?)` | List available agents |
| `createAgent(params)` | Create agent |
| `updateAgent(params)` | Update agent |
| `deleteAgent(params)` | Delete agent |
| `getAgentIdentity(params?)` | Get agent identity |
| `sendToAgent(params)` | Send message to agent |
| `waitForAgent(params)` | Wait for agent run |
| `getAgentFile(params)` | Get agent file |
| `listAgentFiles(params)` | List agent files |
| `setAgentFile(params)` | Set agent file content |

### Chat & Messaging

| Method | Description |
|---|---|
| `sendChat(params)` | Send chat message |
| `getChatHistory(params)` | Get chat history |
| `abortChat(params)` | Abort chat |
| `injectChat(params)` | Inject chat message |
| `send(params)` | Send a message |
| `poll(params)` | Send a poll |
| `wake(params)` | Wake the system |

### Models

| Method | Description |
|---|---|
| `listModels(params?)` | List available models |

### Device Pairing

| Method | Description |
|---|---|
| `listDevicePairings(params?)` | List device pairing requests |
| `approveDevicePairing(params)` | Approve device pairing |
| `rejectDevicePairing(params)` | Reject device pairing |
| `removeDevicePairing(params)` | Remove paired device |
| `rotateDeviceToken(params)` | Rotate device token |
| `revokeDeviceToken(params)` | Revoke device token |

### Node Management

| Method | Description |
|---|---|
| `listNodes(params?)` | List nodes |
| `describeNode(params)` | Describe node |
| `invokeNode(params)` | Invoke node command |
| `renameNode(params)` | Rename node |
| `requestNodePairing(params)` | Request node pairing |
| `listNodePairings(params?)` | List node pairing requests |
| `approveNodePairing(params)` | Approve node pairing |
| `rejectNodePairing(params)` | Reject node pairing |
| `verifyNodePairing(params)` | Verify node pairing |
| `testPush(params)` | Test push notification |

### Wizard

| Method | Description |
|---|---|
| `startWizard(params?)` | Start wizard |
| `wizardNext(params)` | Wizard next step |
| `cancelWizard(params)` | Cancel wizard |
| `getWizardStatus(params)` | Get wizard status |

### Skills

| Method | Description |
|---|---|
| `getSkillsStatus(params?)` | Get skills status |
| `getSkillsBins(params?)` | Get skills bins |
| `installSkill(params)` | Install skill |
| `updateSkill(params)` | Update skill |

### Cron Jobs

| Method | Description |
|---|---|
| `listCronJobs(params?)` | List cron jobs |
| `getCronStatus(params?)` | Get cron status |
| `addCronJob(params)` | Add cron job |
| `updateCronJob(params)` | Update cron job |
| `removeCronJob(params)` | Remove cron job |
| `runCronJob(params)` | Run cron job |
| `getCronRuns(params)` | Get cron job runs |

### Execution Approvals

| Method | Description |
|---|---|
| `getExecApprovals(params?)` | Get exec approvals |
| `setExecApprovals(params)` | Set exec approvals |
| `getNodeExecApprovals(params)` | Get node exec approvals |
| `setNodeExecApprovals(params)` | Set node exec approvals |
| `requestExecApproval(params)` | Request exec approval |
| `resolveExecApproval(params)` | Resolve exec approval |

### Channels, Auth & Other

| Method | Description |
|---|---|
| `getChannelsStatus(params?)` | Get channels status |
| `logoutChannel(params)` | Logout from channel |
| `setTalkMode(params)` | Set talk mode |
| `getTalkConfig(params?)` | Get talk config |
| `startWebLogin(params?)` | Start web login |
| `waitForWebLogin(params?)` | Wait for web login |
| `getLogTail(params?)` | Get log tail |
| `updateRun(params)` | Update and run |
| `call(method, params?)` | Generic RPC call |

## Server-Side Usage

`ServerOpenClawClient` manages connection lifecycle for server actions (Next.js, etc.):

```typescript
import { ServerOpenClawClient, createServerClient } from 'openclaw-client';

// Create from environment variables
const serverClient = createServerClient();

export async function myAction() {
  return serverClient.withClient(async (client) => {
    return await client.listSessions();
  });
}
```

Environment variables:
- `OPENCLAW_GATEWAY_URL` — Gateway URL (default: `http://localhost:18789`)
- `OPENCLAW_TOKEN` — Authentication token

## Advanced: Manual Device Signing

If you need full control over the signing process, use `connectParams` as a function instead of `deviceIdentity`:

```typescript
const client = new OpenClawClient({
  gatewayUrl: 'wss://gateway.example.com',
  token: 'your-token',
  connectParams: async (challenge) => ({
    device: {
      id: myDeviceId,
      publicKey: myPublicKey,
      signature: await sign(challenge.nonce),
      signedAt: Date.now(),
      nonce: challenge.nonce,
    },
  }),
});
```

## Type Generation

Types are auto-generated from the OpenClaw protocol schema:

```bash
# 1. Place updated schema
cp /path/to/protocol.schema.json src/protocol.schema.json

# 2. Regenerate types
npm run generate:types

# 3. Build
npm run build
```

See `src/generate-openclaw-types.ts` for the generation logic.

## License

MIT
