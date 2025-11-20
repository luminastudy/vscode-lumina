import type {
  ExtensionContext,
  CustomReadonlyEditorProvider,
  CustomDocument,
  Uri,
  CustomDocumentOpenContext,
  CancellationToken,
  WebviewPanel,
  Webview,
} from 'vscode'
import { window } from 'vscode'

/**
 * Provider for Lumina Blocks custom editor
 */
export class LuminaBlocksEditorProvider
  implements CustomReadonlyEditorProvider
{
  public static get viewType(): string {
    return 'lumina.blocksPreview'
  }

  constructor(_context: ExtensionContext) {
    // Context will be used in future implementations
  }

  /**
   * Called when a custom editor is opened
   */
  public async openCustomDocument(
    uri: Uri,
    _openContext: CustomDocumentOpenContext,
    _token: CancellationToken
  ): Promise<CustomDocument> {
    return {
      uri,
      dispose: () => {
        // Clean up any resources
      },
    }
  }

  /**
   * Called to render the custom editor
   */
  public async resolveCustomEditor(
    document: CustomDocument,
    webviewPanel: WebviewPanel,
    _token: CancellationToken
  ): Promise<void> {
    // Set up the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    }

    // Set the HTML content for the webview
    webviewPanel.webview.html = this.getHtmlForWebview(
      webviewPanel.webview,
      document.uri
    )

    // Listen for messages from the webview
    webviewPanel.webview.onDidReceiveMessage(
      (message: { type: string; text?: string }): void => {
        switch (message.type) {
          case 'error': {
            window.showErrorMessage(message.text || 'Unknown error')
            break
          }
        }
      }
    )
  }

  /**
   * Generate the HTML content for the webview
   */
  private getHtmlForWebview(_webview: Webview, _documentUri: Uri): string {
    // TODO: Read the JSON file content and pass to visualization
    // const fileContent = workspace.fs.readFile(documentUri)

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lumina Blocks Preview</title>
        <style>
            body {
                padding: 0;
                margin: 0;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
            }
            #root {
                width: 100%;
                height: 100%;
            }
            .error {
                color: red;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div id="root">Loading...</div>
        <script>
            (function() {
                const vscode = acquireVsCodeApi();

                // This will be replaced with actual implementation
                // that uses @lumina-study/blocks-graph to render the JSON

                document.getElementById('root').innerHTML =
                    '<div class="error">Lumina Blocks Graph rendering coming soon...</div>';

                // TODO: Implement actual rendering using @lumina-study/blocks-graph
                // 1. Parse the JSON file
                // 2. Use blocks-graph library to create visualization
                // 3. Handle errors and edge cases
            })();
        </script>
    </body>
    </html>`
  }
}
