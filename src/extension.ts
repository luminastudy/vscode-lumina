import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { ExtensionActivationError } from './errors'
import { LuminaBlocksEditorProvider } from './LuminaBlocksEditorProvider'
import { getLogger, Logger } from './logger'

const CONTEXT = 'Extension'

/**
 * This method is called when the extension is activated
 */
export function activate(context: ExtensionContext): void {
  const logger = getLogger()
  const endActivation = logger.startOperation('Extension activation', CONTEXT)

  logger.separator('Lumina Blocks Preview Extension')
  logger.info('Extension activating...', CONTEXT)
  logger.debug(`Extension path: ${context.extensionPath}`, CONTEXT)
  logger.debug(`Extension mode: ${context.extensionMode}`, CONTEXT)
  logger.debug(
    `Storage path: ${context.storageUri ? context.storageUri.fsPath : 'undefined'}`,
    CONTEXT
  )
  logger.debug(
    `Global storage path: ${context.globalStorageUri ? context.globalStorageUri.fsPath : 'undefined'}`,
    CONTEXT
  )

  try {
    // Register the custom editor provider
    logger.debug('Registering custom editor provider...', CONTEXT)
    const provider = new LuminaBlocksEditorProvider(context)

    const registration = window.registerCustomEditorProvider(
      LuminaBlocksEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    )

    context.subscriptions.push(registration)
    logger.info(
      `Custom editor provider registered for viewType: ${LuminaBlocksEditorProvider.viewType}`,
      CONTEXT
    )

    // Register logger for cleanup
    context.subscriptions.push(Logger.getInstance())
    logger.debug(
      `Total subscriptions registered: ${context.subscriptions.length}`,
      CONTEXT
    )

    endActivation()
    logger.info('Extension activated successfully', CONTEXT)
  } catch (error) {
    if (error instanceof ExtensionActivationError) {
      logger.error('Failed to activate extension', error, CONTEXT)
      throw error
    }
    const activationError = new ExtensionActivationError(
      error instanceof Error ? error.message : String(error),
      error
    )
    logger.error('Failed to activate extension', activationError, CONTEXT)
    throw activationError
  }
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate(): void {
  const logger = getLogger()
  logger.separator('Extension Deactivation')
  logger.info('Extension deactivating...', CONTEXT)
  logger.info('Extension deactivated successfully', CONTEXT)
  // Note: Logger will be disposed via subscription cleanup
}
