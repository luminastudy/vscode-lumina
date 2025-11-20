import { vi } from 'vitest'

// Mock VSCode API for testing
export const window = {
  showErrorMessage: vi.fn(),
  showInformationMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  registerCustomEditorProvider: vi.fn(),
}

export const workspace = {
  fs: {
    readFile: vi.fn(),
  },
}

export const Uri = {
  parse: vi.fn(),
}
