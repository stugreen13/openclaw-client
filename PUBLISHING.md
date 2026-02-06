# Publishing Guide

## First Time Setup

1. Create an npm account at https://www.npmjs.com/signup if you don't have one

2. Login to npm from the command line:
```bash
npm login
```

## Publishing to npm

1. **Update version** (if needed):
```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

2. **Publish the package**:
```bash
npm publish
```

That's it! The `prepublishOnly` script will automatically build the package before publishing.

## After Publishing

Install in your projects:
```bash
npm install openclaw-client
# or
pnpm add openclaw-client
```

## Updating Types

When OpenClaw protocol changes:

1. Update `src/protocol.schema.json` with the new schema
2. Run `npm run generate:types` to regenerate TypeScript types
3. Build and test: `npm run build`
4. Bump version and publish

## Package Contents

The published package includes:
- ✅ `dist/` - Compiled JavaScript and TypeScript definitions
- ✅ `src/` - Original TypeScript source files
- ✅ `README.md` - Documentation
- ❌ `node_modules/` - Excluded
- ❌ Test/example files - Excluded

## Testing Before Publishing

Test locally in another project:
```bash
cd /path/to/your-project
npm install /path/to/openclaw-client
```

Or use `npm link`:
```bash
# In openclaw-client directory
npm link

# In your project
npm link openclaw-client
```
