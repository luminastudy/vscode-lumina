import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { LuminaBlocksEditorProvider } from './LuminaBlocksEditorProvider'

/**
 * This method is called when the extension is activated
 */
export function activate(context: ExtensionContext): void {
  console.log('Lumina Blocks Preview extension is now active')

  // Register the custom editor provider
  const provider = new LuminaBlocksEditorProvider(context)
  context.subscriptions.push(
    window.registerCustomEditorProvider(
      LuminaBlocksEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    )
  )
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate(): void {
  console.log('Lumina Blocks Preview extension is now deactivated')
}
