# Lumina Blocks Preview

A Visual Studio Code extension that provides a custom preview for JSON files using the `@lumina-study/blocks-graph` visualization library.

## Features

- 📊 **Visual JSON Preview**: View JSON files with interactive block graph visualization
- 🎨 **Custom Editor**: Seamless integration with VSCode's editor system
- ⚡ **Fast & Lightweight**: Built with performance in mind
- 🔄 **Auto-refresh**: Updates when JSON file changes

## Installation

### From VS Marketplace (Coming Soon)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Lumina Blocks Preview"
4. Click Install

### From VSIX File

1. Download the `.vsix` file from releases
2. Open VS Code
3. Go to Extensions
4. Click "..." menu → "Install from VSIX..."
5. Select the downloaded file

### From Source

```bash
# Clone the repository
git clone https://github.com/luminastudy/vscode-lumina.git
cd vscode-lumina

# Install dependencies
pnpm install

# Build the extension
pnpm build

# Package the extension
pnpm package

# Install the .vsix file in VS Code
```

## Usage

1. Open any `.json` file in VS Code
2. Right-click in the editor
3. Select "Reopen With..." → "Lumina Blocks Preview"
4. The JSON content will be visualized using the blocks graph

Alternatively, set Lumina Blocks Preview as the default editor for JSON files:

1. Right-click on a `.json` file
2. Select "Open With..."
3. Choose "Lumina Blocks Preview"
4. Check "Use this editor for all .json files"

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm
- Visual Studio Code

### Setup

```bash
# Install dependencies
pnpm install

# Build in watch mode
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

### Testing

Run the extension in development mode:

1. Open this project in VS Code
2. Press `F5` to start debugging
3. A new Extension Development Host window will open
4. Open a `.json` file and test the extension

### Commands

- `pnpm build` - Build the extension
- `pnpm dev` - Build in watch mode
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Check code quality
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code
- `pnpm format:check` - Check code formatting
- `pnpm spell` - Check spelling
- `pnpm package` - Package extension as .vsix

## Project Structure

```
vscode-lumina/
├── src/
│   ├── extension.ts                      # Extension entry point
│   ├── LuminaBlocksEditorProvider.ts    # Custom editor implementation
│   └── *.spec.ts                         # Test files
├── resources/                            # Extension resources (icons, etc.)
├── dist/                                 # Compiled output
├── .github/workflows/                    # CI/CD pipelines
├── package.json                          # Extension manifest
├── tsconfig.json                         # TypeScript configuration
├── vitest.config.ts                      # Test configuration
└── README.md                             # This file
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Testing Coverage

This project maintains 80% minimum code coverage across all metrics:

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

Run `pnpm test:coverage` to generate coverage reports.

## CI/CD

This project uses GitHub Actions for continuous integration:

- ✅ Linting with ESLint
- ✅ Code formatting check with Prettier
- ✅ Spell checking with cspell
- ✅ Unit tests with Vitest
- ✅ Coverage reporting to Codecov
- ✅ Building the extension
- ✅ Automatic publishing to VS Marketplace on version bumps

## Releasing

To publish a new version:

1. Update version in `package.json`
2. Commit and push to `main`
3. GitHub Actions will automatically:
   - Run all tests
   - Package the extension
   - Publish to VS Marketplace (if version changed)

## License

MIT © Lumina Study

See [LICENSE](LICENSE) for details.

## Support

- 🐛 [Report a bug](https://github.com/luminastudy/vscode-lumina/issues/new?labels=bug)
- 💡 [Request a feature](https://github.com/luminastudy/vscode-lumina/issues/new?labels=enhancement)
- 💬 [Ask a question](https://github.com/luminastudy/vscode-lumina/discussions)

## Related Projects

- [@lumina-study/blocks-graph](https://www.npmjs.com/package/@lumina-study/blocks-graph) - The visualization library powering this extension

---

Made with ❤️ by the Lumina Study team
