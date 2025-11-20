# Contributing to vscode-lumina

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this VSCode extension project.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `pnpm install`
3. **Create a branch** for your changes: `git checkout -b feature/your-feature-name`

## Development Workflow

### Prerequisites

- Node.js >= 20.0.0
- pnpm (latest version)
- Visual Studio Code

### Setup

```bash
# Install dependencies
pnpm install

# Build the extension
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Development Commands

- `pnpm dev` - Build in watch mode
- `pnpm test` - Run tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Check code quality
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code
- `pnpm format:check` - Check formatting
- `pnpm spell` - Check spelling
- `pnpm package` - Package extension as .vsix file

### Testing the Extension

1. Open this project in VS Code
2. Press `F5` to open a new Extension Development Host window
3. Open a `.json` file and select "Lumina Blocks Preview" from the editor options
4. Test the extension functionality

## Making Changes

### Code Style

This project uses:

- **TypeScript** with strict mode
- **ESLint** with `eslint-config-agent` for linting
- **Prettier** for code formatting
- **cspell** for spell checking

The codebase follows these conventions:

- CommonJS modules for VSCode extensions
- Strict TypeScript types
- Descriptive variable and function names
- Comprehensive JSDoc comments for public APIs
- Import types separately from values

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(preview): add JSON parsing and visualization
fix(webview): handle malformed JSON files gracefully
docs(readme): update installation instructions
```

### Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass: `pnpm test`
- Maintain or improve code coverage (80% minimum)
- Tests should be in `.spec.ts` files next to their corresponding logic files (DDD approach)
- Use descriptive test names

### Git Hooks

This project uses Husky for git hooks:

- **Pre-commit**: Runs lint-staged (lints, formats, and spell-checks staged files)
- **Commit-msg**: Validates commit message format using commitlint (enforces conventional commits)
- **Pre-push**: Runs full validation (lint, format, spell check, tests)

These hooks ensure code quality and consistent commit messages before commits and pushes.

**Important**: Commit messages must follow the conventional commits format or they will be rejected. See the "Commit Messages" section above for details.

## Submitting Changes

### Pull Request Process

1. **Update your fork** with the latest changes from main:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Rebase your branch** (if needed):

   ```bash
   git checkout your-branch
   git rebase main
   ```

3. **Run all checks locally**:

   ```bash
   pnpm lint
   pnpm format:check
   pnpm spell
   pnpm test
   pnpm build
   ```

4. **Push your changes**:

   ```bash
   git push origin your-branch
   ```

5. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to any related issues
   - Screenshots (if UI changes)

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive PR titles and descriptions
- Link related issues using "Fixes #123" or "Closes #123"
- Ensure CI passes (tests, linting, formatting)
- Respond to review feedback promptly
- Keep commits clean and well-organized

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: VSCode version, Node.js version, OS, extension version
- **Error messages**: Full error messages or stack traces
- **JSON sample**: Sample JSON file that causes the issue (if applicable)

### Feature Requests

When requesting features, please include:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: What alternatives have you considered?
- **Examples**: Examples of similar features elsewhere

## VSCode Extension Development

### Extension Structure

- `src/extension.ts` - Extension entry point (activation/deactivation)
- `src/LuminaBlocksEditorProvider.ts` - Custom editor provider implementation
- `package.json` - Extension manifest with contributions and dependencies

### VSCode Extension Testing

- Use VSCode's Extension Development Host for manual testing
- Mock VSCode API in unit tests
- Test with various JSON file sizes and structures

### Publishing

The extension is automatically published to VS Marketplace when:

- A push is made to the `main` branch
- The version in `package.json` has been incremented
- All CI checks pass

Maintainers can also manually publish using:

```bash
pnpm publish
```

This requires a Personal Access Token (PAT) from Azure DevOps with Marketplace publishing permissions.

## Questions?

- Check existing issues and discussions
- Read the documentation in README.md
- Open a new issue with the "question" label

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and beginners
- Focus on constructive feedback
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
