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
import { window, workspace } from 'vscode'

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

    // Read the JSON file
    let jsonContent = ''
    try {
      const fileData = await workspace.fs.readFile(document.uri)
      const textDecoder = new TextDecoder('utf-8')
      jsonContent = textDecoder.decode(fileData)
    } catch (error) {
      window.showErrorMessage(
        `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      jsonContent = JSON.stringify({ error: 'Failed to read file' })
    }

    // Set the HTML content for the webview
    webviewPanel.webview.html = this.getHtmlForWebview(
      webviewPanel.webview,
      jsonContent
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
  private getHtmlForWebview(_webview: Webview, jsonContent: string): string {
    // Escape JSON for safe embedding in HTML
    const escapedJson = jsonContent
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://esm.sh; connect-src https://cdn.jsdelivr.net https://esm.sh; img-src data: https:;">
        <title>Lumina Blocks Preview</title>
        <style>
            body {
                padding: 0;
                margin: 0;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            #root {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            .error {
                color: #f44336;
                padding: 20px;
                background: #ffebee;
                border-left: 4px solid #f44336;
                margin: 20px;
            }
            .loading {
                padding: 20px;
                text-align: center;
                color: #666;
            }
            blocks-graph {
                flex: 1;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div id="root">
            <div class="loading">Loading blocks graph...</div>
        </div>
        <script type="module">
            const vscode = acquireVsCodeApi();
            const jsonContent = ${JSON.stringify(escapedJson)};

            async function initializeGraph() {
                try {
                    // Parse JSON to validate it
                    const parsedJson = JSON.parse(jsonContent);

                    // Import the blocks-graph library from CDN
                    const { BlocksGraph } = await import('https://cdn.jsdelivr.net/npm/@lumina-study/blocks-graph@0.1.3/+esm');

                    // Clear loading message
                    document.getElementById('root').innerHTML = '';

                    // Create blocks-graph element
                    const graph = document.createElement('blocks-graph');
                    graph.setAttribute('language', 'en');
                    graph.setAttribute('show-prerequisites', 'true');
                    graph.setAttribute('show-parents', 'true');
                    document.getElementById('root').appendChild(graph);

                    // Load the JSON data
                    graph.loadFromJson(jsonContent, 'v0.1');

                } catch (error) {
                    console.error('Error rendering blocks graph:', error);
                    document.getElementById('root').innerHTML =
                        '<div class="error">' +
                        '<strong>Error rendering blocks graph:</strong><br>' +
                        (error.message || 'Unknown error') +
                        '</div>';

                    vscode.postMessage({
                        type: 'error',
                        text: 'Error rendering blocks graph: ' + (error.message || 'Unknown error')
                    });
                }
            }

            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeGraph);
            } else {
                initializeGraph();
            }
        </script>
    </body>
    </html>`
  }
}
