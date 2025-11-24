/**
 * Custom error class for extension activation failures
 */
export class ExtensionActivationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'ExtensionActivationError'
  }
}

/**
 * Custom error class for file reading failures
 */
export class FileReadError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'FileReadError'
  }
}

/**
 * Custom error class for JSON parsing failures
 */
export class JsonParseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'JsonParseError'
  }
}

/**
 * Custom error class for webview-related failures
 */
export class WebviewError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'WebviewError'
  }
}
