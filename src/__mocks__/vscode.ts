import { vi } from 'vitest'

// Mock OutputChannel for logging
const mockOutputChannel = {
  appendLine: vi.fn(),
  append: vi.fn(),
  clear: vi.fn(),
  show: vi.fn(),
  hide: vi.fn(),
  dispose: vi.fn(),
  name: 'Lumina Blocks Preview',
  replace: vi.fn(),
}

// Mock VSCode API for testing
export const window = {
  showErrorMessage: vi.fn(),
  showInformationMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  registerCustomEditorProvider: vi.fn(),
  createOutputChannel: vi.fn(() => mockOutputChannel),
}

export const workspace = {
  fs: {
    readFile: vi.fn(),
  },
}

export const Uri = {
  parse: vi.fn(),
}
