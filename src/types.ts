/* Auto-generated from OpenClaw protocol schema */
/* Do not edit manually */

/**
 * Handshake, request/response, and event frames for the Gateway WebSocket.
 */
export type OpenClawGatewayProtocol = RequestFrame | ResponseFrame | EventFrame;

export interface RequestFrame {
  type: 'req';
  id: string;
  method: string;
  params?: any;
}
export interface ResponseFrame {
  type: 'res';
  id: string;
  ok: boolean;
  payload?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
    retryable?: boolean;
    retryAfterMs?: number;
  };
}
export interface EventFrame {
  type: 'event';
  event: string;
  payload?: any;
  seq?: number;
  stateVersion?: {
    presence: number;
    health: number;
  };
}

export interface ConnectParams {
  minProtocol: number;
  maxProtocol: number;
  client: {
    id:
      | 'webchat-ui'
      | 'openclaw-control-ui'
      | 'webchat'
      | 'cli'
      | 'gateway-client'
      | 'openclaw-macos'
      | 'openclaw-ios'
      | 'openclaw-android'
      | 'node-host'
      | 'test'
      | 'fingerprint'
      | 'openclaw-probe';
    displayName?: string;
    version: string;
    platform: string;
    deviceFamily?: string;
    modelIdentifier?: string;
    mode: 'webchat' | 'cli' | 'ui' | 'backend' | 'node' | 'probe' | 'test';
    instanceId?: string;
  };
  caps?: string[];
  commands?: string[];
  permissions?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: boolean;
  };
  pathEnv?: string;
  role?: string;
  scopes?: string[];
  device?: {
    id: string;
    publicKey: string;
    signature: string;
    signedAt: number;
    nonce?: string;
  };
  auth?: {
    token?: string;
    password?: string;
  };
  locale?: string;
  userAgent?: string;
}

export interface HelloOk {
  type: 'hello-ok';
  protocol: number;
  server: {
    version: string;
    commit?: string;
    host?: string;
    connId: string;
  };
  features: {
    methods: string[];
    events: string[];
  };
  snapshot: {
    presence: {
      host?: string;
      ip?: string;
      version?: string;
      platform?: string;
      deviceFamily?: string;
      modelIdentifier?: string;
      mode?: string;
      lastInputSeconds?: number;
      reason?: string;
      tags?: string[];
      text?: string;
      ts: number;
      deviceId?: string;
      roles?: string[];
      scopes?: string[];
      instanceId?: string;
    }[];
    health: any;
    stateVersion: {
      presence: number;
      health: number;
    };
    uptimeMs: number;
    configPath?: string;
    stateDir?: string;
    sessionDefaults?: {
      defaultAgentId: string;
      mainKey: string;
      mainSessionKey: string;
      scope?: string;
    };
  };
  canvasHostUrl?: string;
  auth?: {
    deviceToken: string;
    role: string;
    scopes: string[];
    issuedAtMs?: number;
  };
  policy: {
    maxPayload: number;
    maxBufferedBytes: number;
    tickIntervalMs: number;
  };
}

export type GatewayFrame =
  | {
      type: 'req';
      id: string;
      method: string;
      params?: any;
    }
  | {
      type: 'res';
      id: string;
      ok: boolean;
      payload?: any;
      error?: {
        code: string;
        message: string;
        details?: any;
        retryable?: boolean;
        retryAfterMs?: number;
      };
    }
  | {
      type: 'event';
      event: string;
      payload?: any;
      seq?: number;
      stateVersion?: {
        presence: number;
        health: number;
      };
    };

export interface PresenceEntry {
  host?: string;
  ip?: string;
  version?: string;
  platform?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  mode?: string;
  lastInputSeconds?: number;
  reason?: string;
  tags?: string[];
  text?: string;
  ts: number;
  deviceId?: string;
  roles?: string[];
  scopes?: string[];
  instanceId?: string;
}

export interface StateVersion {
  presence: number;
  health: number;
}

export interface Snapshot {
  presence: {
    host?: string;
    ip?: string;
    version?: string;
    platform?: string;
    deviceFamily?: string;
    modelIdentifier?: string;
    mode?: string;
    lastInputSeconds?: number;
    reason?: string;
    tags?: string[];
    text?: string;
    ts: number;
    deviceId?: string;
    roles?: string[];
    scopes?: string[];
    instanceId?: string;
  }[];
  health: any;
  stateVersion: {
    presence: number;
    health: number;
  };
  uptimeMs: number;
  configPath?: string;
  stateDir?: string;
  sessionDefaults?: {
    defaultAgentId: string;
    mainKey: string;
    mainSessionKey: string;
    scope?: string;
  };
}

export interface ErrorShape {
  code: string;
  message: string;
  details?: any;
  retryable?: boolean;
  retryAfterMs?: number;
}

export interface AgentEvent {
  runId: string;
  seq: number;
  stream: string;
  ts: number;
  data: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: any;
  };
}

export interface SendParams {
  to: string;
  message: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  gifPlayback?: boolean;
  channel?: string;
  accountId?: string;
  sessionKey?: string;
  idempotencyKey: string;
}

export interface PollParams {
  to: string;
  question: string;
  /**
   * @minItems 2
   * @maxItems 12
   */
  options:
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
    | [string, string, string, string, string, string]
    | [string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string];
  maxSelections?: number;
  durationHours?: number;
  channel?: string;
  accountId?: string;
  idempotencyKey: string;
}

export interface AgentParams {
  message: string;
  agentId?: string;
  to?: string;
  replyTo?: string;
  sessionId?: string;
  sessionKey?: string;
  thinking?: string;
  deliver?: boolean;
  attachments?: any[];
  channel?: string;
  replyChannel?: string;
  accountId?: string;
  replyAccountId?: string;
  threadId?: string;
  groupId?: string;
  groupChannel?: string;
  groupSpace?: string;
  timeout?: number;
  lane?: string;
  extraSystemPrompt?: string;
  idempotencyKey: string;
  label?: string;
  spawnedBy?: string;
}

export interface AgentIdentityParams {
  agentId?: string;
  sessionKey?: string;
}

export interface AgentIdentityResult {
  agentId: string;
  name?: string;
  avatar?: string;
  emoji?: string;
}

export interface AgentWaitParams {
  runId: string;
  timeoutMs?: number;
}

export interface WakeParams {
  mode: 'now' | 'next-heartbeat';
  text: string;
}

export interface NodePairRequestParams {
  nodeId: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  remoteIp?: string;
  silent?: boolean;
}

export interface NodePairListParams {}

export interface NodePairApproveParams {
  requestId: string;
}

export interface NodePairRejectParams {
  requestId: string;
}

export interface NodePairVerifyParams {
  nodeId: string;
  token: string;
}

export interface NodeRenameParams {
  nodeId: string;
  displayName: string;
}

export interface NodeListParams {}

export interface NodeDescribeParams {
  nodeId: string;
}

export interface NodeInvokeParams {
  nodeId: string;
  command: string;
  params?: any;
  timeoutMs?: number;
  idempotencyKey: string;
}

export interface NodeInvokeResultParams {
  id: string;
  nodeId: string;
  ok: boolean;
  payload?: any;
  payloadJSON?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface NodeEventParams {
  event: string;
  payload?: any;
  payloadJSON?: string;
}

export interface NodeInvokeRequestEvent {
  id: string;
  nodeId: string;
  command: string;
  paramsJSON?: string;
  timeoutMs?: number;
  idempotencyKey?: string;
}

export interface SessionsListParams {
  limit?: number;
  activeMinutes?: number;
  includeGlobal?: boolean;
  includeUnknown?: boolean;
  includeDerivedTitles?: boolean;
  includeLastMessage?: boolean;
  label?: string;
  spawnedBy?: string;
  agentId?: string;
  search?: string;
}

export interface SessionsPreviewParams {
  /**
   * @minItems 1
   */
  keys: [string, ...string[]];
  limit?: number;
  maxChars?: number;
}

export interface SessionsResolveParams {
  key?: string;
  sessionId?: string;
  label?: string;
  agentId?: string;
  spawnedBy?: string;
  includeGlobal?: boolean;
  includeUnknown?: boolean;
}

export interface SessionsPatchParams {
  key: string;
  label?: string | null;
  thinkingLevel?: string | null;
  verboseLevel?: string | null;
  reasoningLevel?: string | null;
  responseUsage?: 'off' | 'tokens' | 'full' | 'on' | null;
  elevatedLevel?: string | null;
  execHost?: string | null;
  execSecurity?: string | null;
  execAsk?: string | null;
  execNode?: string | null;
  model?: string | null;
  spawnedBy?: string | null;
  sendPolicy?: 'allow' | 'deny' | null;
  groupActivation?: 'mention' | 'always' | null;
}

export interface SessionsResetParams {
  key: string;
}

export interface SessionsDeleteParams {
  key: string;
  deleteTranscript?: boolean;
}

export interface SessionsCompactParams {
  key: string;
  maxLines?: number;
}

export interface ConfigGetParams {}

export interface ConfigSetParams {
  raw: string;
  baseHash?: string;
}

export interface ConfigApplyParams {
  raw: string;
  baseHash?: string;
  sessionKey?: string;
  note?: string;
  restartDelayMs?: number;
}

export interface ConfigPatchParams {
  raw: string;
  baseHash?: string;
  sessionKey?: string;
  note?: string;
  restartDelayMs?: number;
}

export interface ConfigSchemaParams {}

export interface ConfigSchemaResponse {
  schema: any;
  uiHints: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: {
      label?: string;
      help?: string;
      group?: string;
      order?: number;
      advanced?: boolean;
      sensitive?: boolean;
      placeholder?: string;
      itemTemplate?: any;
    };
  };
  version: string;
  generatedAt: string;
}

export interface WizardStartParams {
  mode?: 'local' | 'remote';
  workspace?: string;
}

export interface WizardNextParams {
  sessionId: string;
  answer?: {
    stepId: string;
    value?: any;
  };
}

export interface WizardCancelParams {
  sessionId: string;
}

export interface WizardStatusParams {
  sessionId: string;
}

export interface WizardStep {
  id: string;
  type: 'note' | 'select' | 'text' | 'confirm' | 'multiselect' | 'progress' | 'action';
  title?: string;
  message?: string;
  options?: {
    value: any;
    label: string;
    hint?: string;
  }[];
  initialValue?: any;
  placeholder?: string;
  sensitive?: boolean;
  executor?: 'gateway' | 'client';
}

export interface WizardNextResult {
  done: boolean;
  step?: {
    id: string;
    type: 'note' | 'select' | 'text' | 'confirm' | 'multiselect' | 'progress' | 'action';
    title?: string;
    message?: string;
    options?: {
      value: any;
      label: string;
      hint?: string;
    }[];
    initialValue?: any;
    placeholder?: string;
    sensitive?: boolean;
    executor?: 'gateway' | 'client';
  };
  status?: 'running' | 'done' | 'cancelled' | 'error';
  error?: string;
}

export interface WizardStartResult {
  sessionId: string;
  done: boolean;
  step?: {
    id: string;
    type: 'note' | 'select' | 'text' | 'confirm' | 'multiselect' | 'progress' | 'action';
    title?: string;
    message?: string;
    options?: {
      value: any;
      label: string;
      hint?: string;
    }[];
    initialValue?: any;
    placeholder?: string;
    sensitive?: boolean;
    executor?: 'gateway' | 'client';
  };
  status?: 'running' | 'done' | 'cancelled' | 'error';
  error?: string;
}

export interface WizardStatusResult {
  status: 'running' | 'done' | 'cancelled' | 'error';
  error?: string;
}

export interface TalkModeParams {
  enabled: boolean;
  phase?: string;
}

export interface ChannelsStatusParams {
  probe?: boolean;
  timeoutMs?: number;
}

export interface ChannelsStatusResult {
  ts: number;
  channelOrder: string[];
  channelLabels: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: string;
  };
  channelDetailLabels?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: string;
  };
  channelSystemImages?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: string;
  };
  channelMeta?: {
    id: string;
    label: string;
    detailLabel: string;
    systemImage?: string;
  }[];
  channels: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: any;
  };
  channelAccounts: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: {
      accountId: string;
      name?: string;
      enabled?: boolean;
      configured?: boolean;
      linked?: boolean;
      running?: boolean;
      connected?: boolean;
      reconnectAttempts?: number;
      lastConnectedAt?: number;
      lastError?: string;
      lastStartAt?: number;
      lastStopAt?: number;
      lastInboundAt?: number;
      lastOutboundAt?: number;
      lastProbeAt?: number;
      mode?: string;
      dmPolicy?: string;
      allowFrom?: string[];
      tokenSource?: string;
      botTokenSource?: string;
      appTokenSource?: string;
      baseUrl?: string;
      allowUnmentionedGroups?: boolean;
      cliPath?: string | null;
      dbPath?: string | null;
      port?: number | null;
      probe?: any;
      audit?: any;
      application?: any;
      [k: string]: any;
    }[];
  };
  channelDefaultAccountId: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: string;
  };
}

export interface ChannelsLogoutParams {
  channel: string;
  accountId?: string;
}

export interface WebLoginStartParams {
  force?: boolean;
  timeoutMs?: number;
  verbose?: boolean;
  accountId?: string;
}

export interface WebLoginWaitParams {
  timeoutMs?: number;
  accountId?: string;
}

export interface AgentSummary {
  id: string;
  name?: string;
  identity?: {
    name?: string;
    theme?: string;
    emoji?: string;
    avatar?: string;
    avatarUrl?: string;
  };
}

export interface AgentsFileEntry {
  name: string;
  path: string;
  missing: boolean;
  size?: number;
  updatedAtMs?: number;
  content?: string;
}

export interface AgentsFilesListParams {
  agentId: string;
}

export interface AgentsFilesListResult {
  agentId: string;
  workspace: string;
  files: {
    name: string;
    path: string;
    missing: boolean;
    size?: number;
    updatedAtMs?: number;
    content?: string;
  }[];
}

export interface AgentsFilesGetParams {
  agentId: string;
  name: string;
}

export interface AgentsFilesGetResult {
  agentId: string;
  workspace: string;
  file: {
    name: string;
    path: string;
    missing: boolean;
    size?: number;
    updatedAtMs?: number;
    content?: string;
  };
}

export interface AgentsFilesSetParams {
  agentId: string;
  name: string;
  content: string;
}

export interface AgentsFilesSetResult {
  ok: true;
  agentId: string;
  workspace: string;
  file: {
    name: string;
    path: string;
    missing: boolean;
    size?: number;
    updatedAtMs?: number;
    content?: string;
  };
}

export interface AgentsListParams {}

export interface AgentsListResult {
  defaultId: string;
  mainKey: string;
  scope: 'per-sender' | 'global';
  agents: {
    id: string;
    name?: string;
    identity?: {
      name?: string;
      theme?: string;
      emoji?: string;
      avatar?: string;
      avatarUrl?: string;
    };
  }[];
}

export interface ModelChoice {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  reasoning?: boolean;
}

export interface ModelsListParams {}

export interface ModelsListResult {
  models: {
    id: string;
    name: string;
    provider: string;
    contextWindow?: number;
    reasoning?: boolean;
  }[];
}

export interface SkillsStatusParams {
  agentId?: string;
}

export interface SkillsBinsParams {}

export interface SkillsBinsResult {
  bins: string[];
}

export interface SkillsInstallParams {
  name: string;
  installId: string;
  timeoutMs?: number;
}

export interface SkillsUpdateParams {
  skillKey: string;
  enabled?: boolean;
  apiKey?: string;
  env?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^(.*)$".
     */
    [k: string]: string;
  };
}

export interface CronJob {
  id: string;
  agentId?: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleteAfterRun?: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule:
    | {
        kind: 'at';
        at: string;
      }
    | {
        kind: 'every';
        everyMs: number;
        anchorMs?: number;
      }
    | {
        kind: 'cron';
        expr: string;
        tz?: string;
      };
  sessionTarget: 'main' | 'isolated';
  wakeMode: 'next-heartbeat' | 'now';
  payload:
    | {
        kind: 'systemEvent';
        text: string;
      }
    | {
        kind: 'agentTurn';
        message: string;
        model?: string;
        thinking?: string;
        timeoutSeconds?: number;
      };
  delivery?: {
    mode: 'none' | 'announce';
    channel?: 'last' | string;
    to?: string;
    bestEffort?: boolean;
  };
  state: {
    nextRunAtMs?: number;
    runningAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: 'ok' | 'error' | 'skipped';
    lastError?: string;
    lastDurationMs?: number;
  };
}

export interface CronListParams {
  includeDisabled?: boolean;
}

export interface CronStatusParams {}

export interface CronAddParams {
  name: string;
  agentId?: string | null;
  description?: string;
  enabled?: boolean;
  deleteAfterRun?: boolean;
  schedule:
    | {
        kind: 'at';
        at: string;
      }
    | {
        kind: 'every';
        everyMs: number;
        anchorMs?: number;
      }
    | {
        kind: 'cron';
        expr: string;
        tz?: string;
      };
  sessionTarget: 'main' | 'isolated';
  wakeMode: 'next-heartbeat' | 'now';
  payload:
    | {
        kind: 'systemEvent';
        text: string;
      }
    | {
        kind: 'agentTurn';
        message: string;
        model?: string;
        thinking?: string;
        timeoutSeconds?: number;
      };
  delivery?: {
    mode: 'none' | 'announce';
    channel?: 'last' | string;
    to?: string;
    bestEffort?: boolean;
  };
}

export type CronUpdateParams =
  | {
      id: string;
      patch: {
        name?: string;
        agentId?: string | null;
        description?: string;
        enabled?: boolean;
        deleteAfterRun?: boolean;
        schedule?:
          | {
              kind: 'at';
              at: string;
            }
          | {
              kind: 'every';
              everyMs: number;
              anchorMs?: number;
            }
          | {
              kind: 'cron';
              expr: string;
              tz?: string;
            };
        sessionTarget?: 'main' | 'isolated';
        wakeMode?: 'next-heartbeat' | 'now';
        payload?:
          | {
              kind: 'systemEvent';
              text?: string;
            }
          | {
              kind: 'agentTurn';
              message?: string;
              model?: string;
              thinking?: string;
              timeoutSeconds?: number;
            };
        delivery?: {
          mode?: 'none' | 'announce';
          channel?: 'last' | string;
          to?: string;
          bestEffort?: boolean;
        };
        state?: {
          nextRunAtMs?: number;
          runningAtMs?: number;
          lastRunAtMs?: number;
          lastStatus?: 'ok' | 'error' | 'skipped';
          lastError?: string;
          lastDurationMs?: number;
        };
      };
    }
  | {
      jobId: string;
      patch: {
        name?: string;
        agentId?: string | null;
        description?: string;
        enabled?: boolean;
        deleteAfterRun?: boolean;
        schedule?:
          | {
              kind: 'at';
              at: string;
            }
          | {
              kind: 'every';
              everyMs: number;
              anchorMs?: number;
            }
          | {
              kind: 'cron';
              expr: string;
              tz?: string;
            };
        sessionTarget?: 'main' | 'isolated';
        wakeMode?: 'next-heartbeat' | 'now';
        payload?:
          | {
              kind: 'systemEvent';
              text?: string;
            }
          | {
              kind: 'agentTurn';
              message?: string;
              model?: string;
              thinking?: string;
              timeoutSeconds?: number;
            };
        delivery?: {
          mode?: 'none' | 'announce';
          channel?: 'last' | string;
          to?: string;
          bestEffort?: boolean;
        };
        state?: {
          nextRunAtMs?: number;
          runningAtMs?: number;
          lastRunAtMs?: number;
          lastStatus?: 'ok' | 'error' | 'skipped';
          lastError?: string;
          lastDurationMs?: number;
        };
      };
    };

export type CronRemoveParams =
  | {
      id: string;
    }
  | {
      jobId: string;
    };

export type CronRunParams =
  | {
      id: string;
      mode?: 'due' | 'force';
    }
  | {
      jobId: string;
      mode?: 'due' | 'force';
    };

export type CronRunsParams =
  | {
      id: string;
      limit?: number;
    }
  | {
      jobId: string;
      limit?: number;
    };

export interface CronRunLogEntry {
  ts: number;
  jobId: string;
  action: 'finished';
  status?: 'ok' | 'error' | 'skipped';
  error?: string;
  summary?: string;
  runAtMs?: number;
  durationMs?: number;
  nextRunAtMs?: number;
}

export interface LogsTailParams {
  cursor?: number;
  limit?: number;
  maxBytes?: number;
}

export interface LogsTailResult {
  file: string;
  cursor: number;
  size: number;
  lines: string[];
  truncated?: boolean;
  reset?: boolean;
}

export interface ExecApprovalsGetParams {}

export interface ExecApprovalsSetParams {
  file: {
    version: 1;
    socket?: {
      path?: string;
      token?: string;
    };
    defaults?: {
      security?: string;
      ask?: string;
      askFallback?: string;
      autoAllowSkills?: boolean;
    };
    agents?: {
      /**
       * This interface was referenced by `undefined`'s JSON-Schema definition
       * via the `patternProperty` "^(.*)$".
       */
      [k: string]: {
        security?: string;
        ask?: string;
        askFallback?: string;
        autoAllowSkills?: boolean;
        allowlist?: {
          id?: string;
          pattern: string;
          lastUsedAt?: number;
          lastUsedCommand?: string;
          lastResolvedPath?: string;
        }[];
      };
    };
  };
  baseHash?: string;
}

export interface ExecApprovalsNodeGetParams {
  nodeId: string;
}

export interface ExecApprovalsNodeSetParams {
  nodeId: string;
  file: {
    version: 1;
    socket?: {
      path?: string;
      token?: string;
    };
    defaults?: {
      security?: string;
      ask?: string;
      askFallback?: string;
      autoAllowSkills?: boolean;
    };
    agents?: {
      /**
       * This interface was referenced by `undefined`'s JSON-Schema definition
       * via the `patternProperty` "^(.*)$".
       */
      [k: string]: {
        security?: string;
        ask?: string;
        askFallback?: string;
        autoAllowSkills?: boolean;
        allowlist?: {
          id?: string;
          pattern: string;
          lastUsedAt?: number;
          lastUsedCommand?: string;
          lastResolvedPath?: string;
        }[];
      };
    };
  };
  baseHash?: string;
}

export interface ExecApprovalsSnapshot {
  path: string;
  exists: boolean;
  hash: string;
  file: {
    version: 1;
    socket?: {
      path?: string;
      token?: string;
    };
    defaults?: {
      security?: string;
      ask?: string;
      askFallback?: string;
      autoAllowSkills?: boolean;
    };
    agents?: {
      /**
       * This interface was referenced by `undefined`'s JSON-Schema definition
       * via the `patternProperty` "^(.*)$".
       */
      [k: string]: {
        security?: string;
        ask?: string;
        askFallback?: string;
        autoAllowSkills?: boolean;
        allowlist?: {
          id?: string;
          pattern: string;
          lastUsedAt?: number;
          lastUsedCommand?: string;
          lastResolvedPath?: string;
        }[];
      };
    };
  };
}

export interface ExecApprovalRequestParams {
  id?: string;
  command: string;
  cwd?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  timeoutMs?: number;
}

export interface ExecApprovalResolveParams {
  id: string;
  decision: string;
}

export interface DevicePairListParams {}

export interface DevicePairApproveParams {
  requestId: string;
}

export interface DevicePairRejectParams {
  requestId: string;
}

export interface DeviceTokenRotateParams {
  deviceId: string;
  role: string;
  scopes?: string[];
}

export interface DeviceTokenRevokeParams {
  deviceId: string;
  role: string;
}

export interface DevicePairRequestedEvent {
  requestId: string;
  deviceId: string;
  publicKey: string;
  displayName?: string;
  platform?: string;
  clientId?: string;
  clientMode?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  silent?: boolean;
  isRepair?: boolean;
  ts: number;
}

export interface DevicePairResolvedEvent {
  requestId: string;
  deviceId: string;
  decision: string;
  ts: number;
}

export interface ChatHistoryParams {
  sessionKey: string;
  limit?: number;
}

export interface ChatSendParams {
  sessionKey: string;
  message: string;
  thinking?: string;
  deliver?: boolean;
  attachments?: any[];
  timeoutMs?: number;
  idempotencyKey: string;
}

export interface ChatAbortParams {
  sessionKey: string;
  runId?: string;
}

export interface ChatInjectParams {
  sessionKey: string;
  message: string;
  label?: string;
}

export interface ChatEvent {
  runId: string;
  sessionKey: string;
  seq: number;
  state: 'delta' | 'final' | 'aborted' | 'error';
  message?: any;
  errorMessage?: string;
  usage?: any;
  stopReason?: string;
}

export interface UpdateRunParams {
  sessionKey?: string;
  note?: string;
  restartDelayMs?: number;
  timeoutMs?: number;
}

export interface TickEvent {
  ts: number;
}

export interface ShutdownEvent {
  reason: string;
  restartExpectedMs?: number;
}

