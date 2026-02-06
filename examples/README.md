# Examples

This directory contains example code demonstrating various use cases of the openclaw-client library.

## Running Examples

First, ensure you have the package built:

```bash
pnpm install
pnpm build
```

Then set your environment variables:

```bash
export OPENCLAW_GATEWAY_URL="ws://localhost:18789"
export OPENCLAW_TOKEN="your-auth-token"
```

Run an example:

```bash
# Using tsx (recommended for development)
npx tsx examples/basic-client.ts

# Or compile and run with Node.js
npx tsc examples/basic-client.ts
node examples/basic-client.js
```

## Available Examples

### basic-client.ts

Demonstrates basic client usage:
- Connecting to the gateway
- Listing agents and models
- Getting configuration
- Handling events

```bash
npx tsx examples/basic-client.ts
```

### server-client.ts

Shows server-side usage with automatic connection management:
- Using `createServerClient()` helper
- `withClient()` pattern for auto-cleanup
- Parallel requests within a single connection

```bash
npx tsx examples/server-client.ts
```

### events.ts

Event handling example:
- Adding multiple event listeners
- Filtering events by type
- Graceful shutdown
- Long-running event listener

```bash
npx tsx examples/events.ts
```

## Notes

- All examples expect a running OpenClaw Gateway instance
- Default gateway URL is `ws://localhost:18789`
- Make sure to set `OPENCLAW_TOKEN` environment variable
- Examples use TypeScript with tsx for simplicity
