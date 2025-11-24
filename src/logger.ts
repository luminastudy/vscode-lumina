import type { OutputChannel, Disposable } from 'vscode'
import { window } from 'vscode'

/**
 * Log levels for the extension logger
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger class for the Lumina Blocks Preview extension
 * Uses VS Code's OutputChannel for proper logging within the extension context
 */
export class Logger implements Disposable {
  private static instance: Logger | null = null
  private outputChannel: OutputChannel
  private logLevel: LogLevel = LogLevel.DEBUG
  private readonly startTime: number

  private constructor() {
    this.outputChannel = window.createOutputChannel('Lumina Blocks Preview')
    this.startTime = Date.now()
  }

  /**
   * Get the singleton logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  /**
   * Dispose of the logger and its resources
   */
  public dispose(): void {
    this.outputChannel.dispose()
    Logger.instance = null
  }

  /**
   * Set the minimum log level
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level
    const levelName = this.getLevelName(level)
    this.info(`Log level set to: ${levelName}`)
  }

  /**
   * Get the string name for a log level
   */
  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG'
      case LogLevel.INFO:
        return 'INFO'
      case LogLevel.WARN:
        return 'WARN'
      case LogLevel.ERROR:
        return 'ERROR'
      default:
        return 'UNKNOWN'
    }
  }

  /**
   * Get the current log level
   */
  public getLogLevel(): LogLevel {
    return this.logLevel
  }

  /**
   * Show the output channel in VS Code
   */
  public show(): void {
    this.outputChannel.show()
  }

  /**
   * Format a log message with timestamp and level
   */
  private formatMessage(
    level: string,
    message: string,
    context?: string
  ): string {
    const timestamp = new Date().toISOString()
    const elapsed = `+${Date.now() - this.startTime}ms`
    const contextStr = context ? `[${context}]` : ''
    return `[${timestamp}] [${elapsed}] [${level}]${contextStr} ${message}`
  }

  /**
   * Log a debug message
   */
  public debug(message: string, context?: string): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      const formatted = this.formatMessage('DEBUG', message, context)
      this.outputChannel.appendLine(formatted)
    }
  }

  /**
   * Log an info message
   */
  public info(message: string, context?: string): void {
    if (this.logLevel <= LogLevel.INFO) {
      const formatted = this.formatMessage('INFO', message, context)
      this.outputChannel.appendLine(formatted)
    }
  }

  /**
   * Log a warning message
   */
  public warn(message: string, context?: string): void {
    if (this.logLevel <= LogLevel.WARN) {
      const formatted = this.formatMessage('WARN', message, context)
      this.outputChannel.appendLine(formatted)
    }
  }

  /**
   * Log an error message
   */
  public error(message: string, error?: unknown, context?: string): void {
    if (this.logLevel <= LogLevel.ERROR) {
      const formatted = this.formatMessage('ERROR', message, context)
      this.outputChannel.appendLine(formatted)
      if (error) {
        if (error instanceof Error) {
          this.outputChannel.appendLine(`  Error: ${error.message}`)
          if (error.stack) {
            this.outputChannel.appendLine(`  Stack: ${error.stack}`)
          }
        } else {
          this.outputChannel.appendLine(`  Error: ${String(error)}`)
        }
      }
    }
  }

  /**
   * Log an object as formatted JSON
   */
  public debugObject(label: string, obj: unknown, context?: string): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      const formatted = this.formatMessage('DEBUG', `${label}:`, context)
      this.outputChannel.appendLine(formatted)
      try {
        const json = JSON.stringify(obj, null, 2)
        json.split('\n').forEach(line => {
          this.outputChannel.appendLine(`  ${line}`)
        })
      } catch {
        this.outputChannel.appendLine(`  [Unable to stringify object]`)
      }
    }
  }

  /**
   * Log the start of an operation (for timing)
   */
  public startOperation(operationName: string, context?: string): () => void {
    const opStart = Date.now()
    this.debug(`Starting: ${operationName}`, context)
    return () => {
      const duration = Date.now() - opStart
      this.debug(`Completed: ${operationName} (${duration}ms)`, context)
    }
  }

  /**
   * Log a separator line for readability
   */
  public separator(title?: string): void {
    if (title) {
      this.outputChannel.appendLine(
        `\n${'='.repeat(20)} ${title} ${'='.repeat(20)}`
      )
    } else {
      this.outputChannel.appendLine('='.repeat(50))
    }
  }
}

/**
 * Convenience function to get the logger instance
 */
export function getLogger(): Logger {
  return Logger.getInstance()
}
