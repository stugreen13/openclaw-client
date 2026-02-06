# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-05

### Added

- Initial release of openclaw-client
- `OpenClawClient` class for WebSocket-based communication with OpenClaw Gateway
- `ServerOpenClawClient` class for server-side connection management
- Full TypeScript type definitions for OpenClaw Gateway protocol (108 types)
- Type-safe method wrappers for all RPC methods:
  - Configuration management (`getConfig`, `setConfig`, `getConfigSchema`)
  - Session management (`listSessions`, `deleteSession`)
  - Agent operations (`listAgents`, `getAgentIdentity`, `listAgentFiles`, `getAgentFile`, `setAgentFile`)
  - Model listing (`listModels`)
  - Log retrieval (`getLogTail`)
- Event listener system for server-sent events
- Connection lifecycle management
- Request timeout handling (30 seconds)
- Zero runtime dependencies
- Dual ESM/CJS module support
- Comprehensive documentation and examples
- Protocol schema and type generator script (`pnpm generate:types`)
- UPDATING.md guide for keeping protocol types in sync with OpenClaw releases
