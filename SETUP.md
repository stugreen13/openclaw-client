# Setup Guide for openclaw-client

This guide is for maintainers and contributors to set up the development environment and publish the package.

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sbgreen/openclaw-client.git
   cd openclaw-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

   Or using npm:
   ```bash
   npm install
   ```

3. **Build the package**
   ```bash
   pnpm build
   ```

   This will generate:
   - TypeScript declarations (`.d.ts` files)
   - ESM modules (`.mjs` files)
   - CommonJS modules (`.js` files)

## Development Workflow

### Type Checking

```bash
pnpm typecheck
```

### Building

```bash
pnpm build
```

### Testing Locally

You can test the package locally by linking it:

```bash
# In openclaw-client directory
pnpm link --global

# In your test project
pnpm link --global openclaw-client
```

Or use `npm pack` to create a tarball:

```bash
pnpm build
npm pack
# This creates openclaw-client-1.0.0.tgz

# Install in test project
cd /path/to/test/project
npm install /path/to/openclaw-client/openclaw-client-1.0.0.tgz
```

## Publishing to npm

### Prerequisites

1. **npm account** - Create one at https://www.npmjs.com/signup
2. **npm login** - Run `npm login` and enter your credentials
3. **Package name** - Ensure `openclaw-client` is available on npm

### First-time Setup

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### Publishing

1. **Update version** in `package.json` (follow semver)
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Update CHANGELOG.md** with new version and changes

3. **Build and test**
   ```bash
   pnpm build
   pnpm typecheck

   # Test the package contents
   npm pack --dry-run
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "chore: release v1.0.0"
   git tag v1.0.0
   ```

5. **Publish to npm**
   ```bash
   npm publish
   ```

6. **Push to GitHub**
   ```bash
   git push && git push --tags
   ```

### Automated Publishing (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically publishes to npm when you create a GitHub release:

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Create a tag (e.g., `v1.0.0`)
4. Fill in release notes
5. Publish the release
6. The GitHub Action will automatically build and publish to npm

**Note:** You need to add `NPM_TOKEN` to your GitHub repository secrets:
1. Generate an npm access token at https://www.npmjs.com/settings/tokens
2. Go to your GitHub repo → Settings → Secrets and variables → Actions
3. Add a new secret named `NPM_TOKEN` with your npm token

## Project Structure

```
openclaw-client/
├── src/                  # TypeScript source files
│   ├── client.ts         # Main OpenClawClient class
│   ├── types.ts          # Protocol type definitions
│   ├── server-client.ts  # Server-side client manager
│   └── index.ts          # Package exports
├── dist/                 # Build output (generated, not committed)
│   ├── *.d.ts            # TypeScript declarations
│   ├── *.mjs             # ESM modules
│   └── *.js              # CommonJS modules
├── examples/             # Example usage
├── scripts/              # Build scripts
│   └── rename-mjs.js     # Rename .js to .mjs for ESM
├── .github/workflows/    # GitHub Actions CI/CD
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # User documentation
```

## Build Process

The build process consists of three steps:

1. **build:types** - Generate TypeScript declarations
   ```bash
   tsc --emitDeclarationOnly --outDir dist
   ```

2. **build:esm** - Generate ESM modules
   ```bash
   tsc --module esnext --outDir dist --declaration false
   node scripts/rename-mjs.js  # Rename .js to .mjs
   ```

3. **build:cjs** - Generate CommonJS modules
   ```bash
   tsc --module commonjs --moduleResolution node --outDir dist --declaration false
   ```

## Version Management

Follow semantic versioning (semver):

- **Major** (1.0.0 → 2.0.0) - Breaking changes
- **Minor** (1.0.0 → 1.1.0) - New features (backward compatible)
- **Patch** (1.0.0 → 1.0.1) - Bug fixes (backward compatible)

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Type Errors

```bash
# Run type checker
pnpm typecheck
```

### Package Size

```bash
# Check what will be published
npm pack --dry-run

# Check package size
npm pack
ls -lh openclaw-client-*.tgz
```

## Support

For questions or issues, please [open an issue](https://github.com/sbgreen/openclaw-client/issues) on GitHub.
