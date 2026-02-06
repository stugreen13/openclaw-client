# Updating Protocol Types

This guide explains how to update the OpenClaw protocol types when a new version is released.

## When to Update

Check for protocol updates when:
- A new [OpenClaw release](https://github.com/openclaw/openclaw/releases) is published
- You notice protocol-related changes in the OpenClaw changelog
- You encounter type mismatches when connecting to a newer OpenClaw Gateway

## Update Process

### Option 1: Manual Schema Update (Recommended)

1. **Get the latest OpenClaw release**
   ```bash
   # Download and extract the latest OpenClaw npm package
   npm pack openclaw@latest
   tar -xzf openclaw-*.tgz
   ```

2. **Check if the protocol changed**
   ```bash
   # Compare the protocol version or schema
   # The OpenClaw repo runs: pnpm protocol:gen
   # This generates dist/protocol.schema.json
   ```

3. **Update the schema**
   - Option A: If you have access to OpenClaw's source:
     ```bash
     git clone https://github.com/openclaw/openclaw.git
     cd openclaw
     pnpm install
     pnpm protocol:gen
     cp dist/protocol.schema.json /path/to/openclaw-client/protocol.schema.json
     ```

   - Option B: Extract from a build:
     - Clone OpenClaw repo
     - Run `pnpm install && pnpm protocol:gen`
     - Copy `dist/protocol.schema.json` to openclaw-client root

4. **Regenerate TypeScript types**
   ```bash
   cd openclaw-client
   pnpm generate:types
   ```

5. **Verify and test**
   ```bash
   pnpm typecheck
   pnpm build
   ```

6. **Commit the changes**
   ```bash
   git add protocol.schema.json src/types.ts
   git commit -m "Update protocol types to OpenClaw v2026.x.x"
   ```

7. **Update version and publish**
   - Bump version in `package.json` (minor for new features, patch for fixes)
   - Update `CHANGELOG.md`
   - Publish to npm

### Option 2: From OpenClaw Source Repository

If you want to get the absolute latest (including unreleased changes):

```bash
# Clone OpenClaw
git clone https://github.com/openclaw/openclaw.git /tmp/openclaw
cd /tmp/openclaw

# Install and generate schema
pnpm install
pnpm protocol:gen

# Copy schema to openclaw-client
cp dist/protocol.schema.json /path/to/openclaw-client/protocol.schema.json

# Go to openclaw-client and regenerate types
cd /path/to/openclaw-client
pnpm generate:types

# Verify
pnpm typecheck
pnpm build
```

## Automated Checks

You can add a GitHub Action to check for schema updates periodically:

```yaml
# .github/workflows/check-protocol.yml
name: Check Protocol Updates

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check OpenClaw latest release
        run: |
          LATEST=$(curl -s https://api.github.com/repos/openclaw/openclaw/releases/latest | jq -r .tag_name)
          echo "Latest OpenClaw version: $LATEST"
          echo "Check if protocol update is needed"
```

## Schema Version Tracking

The `protocol.schema.json` file includes metadata about its version. Check the top of the file for:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OpenClaw Gateway Protocol",
  "version": "X.X.X",
  ...
}
```

## Breaking Changes

If the protocol has breaking changes:
1. Update the MAJOR version of openclaw-client (e.g., 1.x.x → 2.0.0)
2. Document breaking changes in CHANGELOG.md
3. Update README with migration guide if needed

## Testing

After updating types:

1. **Type-check the examples**
   ```bash
   pnpm typecheck
   ```

2. **Test against a real OpenClaw Gateway**
   ```bash
   export OPENCLAW_GATEWAY_URL="ws://localhost:18789"
   export OPENCLAW_TOKEN="your-token"
   npx tsx examples/basic-client.ts
   ```

3. **Verify all methods still work**
   - Check that all client methods compile
   - Verify event types are correct
   - Test both client and server-client

## Frequency

- **Check monthly** for protocol updates
- **Update immediately** when a breaking change is announced
- **Pin OpenClaw version** in your app's dependencies if stability is critical

## Support

If you encounter issues with protocol updates:
1. Check the [OpenClaw releases](https://github.com/openclaw/openclaw/releases)
2. Review the [OpenClaw changelog](https://github.com/openclaw/openclaw/blob/main/CHANGELOG.md)
3. [Open an issue](https://github.com/sbgreen/openclaw-client/issues) in openclaw-client
