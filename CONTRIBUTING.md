# Contributing to openclaw-client

Thank you for your interest in contributing to openclaw-client! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/openclaw-client.git`
3. Install dependencies: `pnpm install` (or `npm install`)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Building

```bash
pnpm build
```

This will:
1. Generate TypeScript type declarations
2. Build ESM modules (.mjs)
3. Build CommonJS modules (.js)

### Type Checking

```bash
pnpm typecheck
```

### Project Structure

```
openclaw-client/
├── src/              # Source TypeScript files
│   ├── client.ts     # Main OpenClawClient class
│   ├── types.ts      # Protocol type definitions
│   ├── server-client.ts  # Server-side client manager
│   └── index.ts      # Package exports
├── dist/             # Build output (generated)
├── scripts/          # Build scripts
└── package.json
```

## Making Changes

### Code Style

- Use TypeScript
- Follow existing code style
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

### Type Definitions

The protocol types in `src/types.ts` are auto-generated from the OpenClaw Gateway protocol schema. Do not edit these manually unless updating the protocol version.

### Commit Messages

Use clear, descriptive commit messages:

- `feat: add support for new RPC method`
- `fix: handle connection timeout correctly`
- `docs: update API examples`
- `chore: update dependencies`

## Submitting Changes

1. Ensure your code builds: `pnpm build`
2. Ensure type checking passes: `pnpm typecheck`
3. Commit your changes with a clear message
4. Push to your fork
5. Open a Pull Request

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure CI checks pass
- Keep PRs focused on a single feature or fix

## Releasing (Maintainers Only)

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new version and changes
3. Commit changes: `git commit -am "chore: release v1.x.x"`
4. Create a git tag: `git tag v1.x.x`
5. Push with tags: `git push && git push --tags`
6. Publish to npm: `npm publish`

## Questions?

If you have questions, please [open an issue](https://github.com/sbgreen/openclaw-client/issues) or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
