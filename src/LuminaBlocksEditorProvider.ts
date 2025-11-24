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
import { getLogger } from './logger'

const CONTEXT = 'EditorProvider'

/**
 * Provider for Lumina Blocks custom editor
 */
export class LuminaBlocksEditorProvider
  implements CustomReadonlyEditorProvider
{
  public static get viewType(): string {
    return 'lumina.blocksPreview'
  }

  private readonly logger = getLogger()
  private documentCount = 0
  private webviewCount = 0

  constructor(_context: ExtensionContext) {
    this.logger.debug('LuminaBlocksEditorProvider instantiated', CONTEXT)
  }

  /**
   * Called when a custom editor is opened
   */
  public async openCustomDocument(
    uri: Uri,
    _openContext: CustomDocumentOpenContext,
    _token: CancellationToken
  ): Promise<CustomDocument> {
    this.documentCount++
    const docId = this.documentCount

    this.logger.separator(`Opening Document #${docId}`)
    this.logger.info(`Opening document: ${uri.fsPath}`, CONTEXT)
    this.logger.debug(`URI scheme: ${uri.scheme}`, CONTEXT)
    this.logger.debug(`URI path: ${uri.path}`, CONTEXT)
    this.logger.debug(
      `Total documents opened this session: ${this.documentCount}`,
      CONTEXT
    )

    return {
      uri,
      dispose: () => {
        this.logger.debug(`Document disposed: ${uri.fsPath}`, CONTEXT)
        this.logger.debug(`Document #${docId} resources cleaned up`, CONTEXT)
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
    this.webviewCount++
    const webviewId = this.webviewCount
    const endResolve = this.logger.startOperation(
      `Resolve custom editor #${webviewId}`,
      CONTEXT
    )

    this.logger.info(
      `Resolving custom editor for: ${document.uri.fsPath}`,
      CONTEXT
    )
    this.logger.debug(`Webview panel title: ${webviewPanel.title}`, CONTEXT)
    this.logger.debug(
      `Webview panel viewType: ${webviewPanel.viewType}`,
      CONTEXT
    )
    this.logger.debug(`Webview panel active: ${webviewPanel.active}`, CONTEXT)
    this.logger.debug(`Webview panel visible: ${webviewPanel.visible}`, CONTEXT)

    // Set up the webview
    this.logger.debug('Configuring webview options...', CONTEXT)
    webviewPanel.webview.options = {
      enableScripts: true,
    }
    this.logger.debug('Webview scripts enabled', CONTEXT)

    // Read the JSON file
    this.logger.debug('Reading JSON file...', CONTEXT)
    const endFileRead = this.logger.startOperation('File read', CONTEXT)
    let jsonContent = ''
    let fileSize = 0

    try {
      const fileData = await workspace.fs.readFile(document.uri)
      fileSize = fileData.byteLength
      const textDecoder = new TextDecoder('utf-8')
      jsonContent = textDecoder.decode(fileData)
      endFileRead()

      this.logger.info(`File read successfully: ${fileSize} bytes`, CONTEXT)
      this.logger.debug(
        `Content length: ${jsonContent.length} characters`,
        CONTEXT
      )
      this.logger.debug(
        `Content preview: ${jsonContent.substring(0, 100)}...`,
        CONTEXT
      )

      // Validate JSON structure
      try {
        const parsed = JSON.parse(jsonContent)
        const topLevelKeys = Object.keys(parsed)
        this.logger.debug(`JSON parsed successfully`, CONTEXT)
        this.logger.debug(
          `Top-level keys: [${topLevelKeys.join(', ')}]`,
          CONTEXT
        )
        if (Array.isArray(parsed)) {
          this.logger.debug(
            `JSON is array with ${parsed.length} elements`,
            CONTEXT
          )
        } else if (typeof parsed === 'object' && parsed !== null) {
          this.logger.debug(
            `JSON is object with ${topLevelKeys.length} keys`,
            CONTEXT
          )
        }
      } catch (parseError) {
        this.logger.warn(
          `JSON validation failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          CONTEXT
        )
      }
    } catch (error) {
      this.logger.error('Failed to read file', error, CONTEXT)
      window.showErrorMessage(
        `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      jsonContent = JSON.stringify({ error: 'Failed to read file' })
    }

    // Set the HTML content for the webview
    this.logger.debug('Generating HTML content for webview...', CONTEXT)
    const endHtmlGeneration = this.logger.startOperation(
      'HTML generation',
      CONTEXT
    )
    webviewPanel.webview.html = this.getHtmlForWebview(
      webviewPanel.webview,
      jsonContent,
      webviewId
    )
    endHtmlGeneration()
    this.logger.debug('Webview HTML content set', CONTEXT)

    // Listen for messages from the webview
    this.logger.debug('Setting up webview message listener...', CONTEXT)
    webviewPanel.webview.onDidReceiveMessage(
      (message: {
        type: string
        text?: string
        level?: string
        data?: unknown
      }): void => {
        this.logger.debug(
          `Received message from webview #${webviewId}`,
          CONTEXT
        )
        this.logger.debugObject('Message payload', message, CONTEXT)

        switch (message.type) {
          case 'error': {
            this.logger.error(
              `Webview error: ${message.text || 'Unknown error'}`,
              undefined,
              CONTEXT
            )
            window.showErrorMessage(message.text || 'Unknown error')
            break
          }
          case 'log': {
            const level = message.level || 'debug'
            const text = message.text || ''
            switch (level) {
              case 'info':
                this.logger.info(`[Webview] ${text}`, CONTEXT)
                break
              case 'warn':
                this.logger.warn(`[Webview] ${text}`, CONTEXT)
                break
              case 'error':
                this.logger.error(`[Webview] ${text}`, undefined, CONTEXT)
                break
              default:
                this.logger.debug(`[Webview] ${text}`, CONTEXT)
            }
            break
          }
          case 'ready': {
            this.logger.info(`Webview #${webviewId} reported ready`, CONTEXT)
            break
          }
          case 'graphLoaded': {
            this.logger.info(
              `Webview #${webviewId} graph loaded successfully`,
              CONTEXT
            )
            if (message.data) {
              this.logger.debugObject('Graph load data', message.data, CONTEXT)
            }
            break
          }
          default: {
            this.logger.debug(`Unknown message type: ${message.type}`, CONTEXT)
          }
        }
      }
    )

    // Track webview lifecycle
    webviewPanel.onDidChangeViewState(e => {
      this.logger.debug(`Webview #${webviewId} view state changed`, CONTEXT)
      this.logger.debug(`  Active: ${e.webviewPanel.active}`, CONTEXT)
      this.logger.debug(`  Visible: ${e.webviewPanel.visible}`, CONTEXT)
    })

    webviewPanel.onDidDispose(() => {
      this.logger.info(`Webview #${webviewId} disposed`, CONTEXT)
    })

    endResolve()
    this.logger.info(
      `Custom editor #${webviewId} resolved successfully`,
      CONTEXT
    )
  }

  /**
   * Generate the HTML content for the webview
   */
  private getHtmlForWebview(
    _webview: Webview,
    jsonContent: string,
    webviewId: number
  ): string {
    this.logger.debug(`Generating HTML for webview #${webviewId}`, CONTEXT)

    // Escape JSON for safe embedding in HTML
    const escapedJson = jsonContent
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')

    this.logger.debug(`JSON escaped for HTML embedding`, CONTEXT)
    this.logger.debug(
      `Escaped content length: ${escapedJson.length} characters`,
      CONTEXT
    )

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
            const webviewId = ${webviewId};
            const jsonContent = ${JSON.stringify(escapedJson)};
            const initStartTime = performance.now();

            // Logger helper for webview
            const webviewLog = {
                debug: (msg, data) => {
                    console.debug('[Lumina Webview]', msg, data || '');
                    vscode.postMessage({ type: 'log', level: 'debug', text: msg, data });
                },
                info: (msg, data) => {
                    console.info('[Lumina Webview]', msg, data || '');
                    vscode.postMessage({ type: 'log', level: 'info', text: msg, data });
                },
                warn: (msg, data) => {
                    console.warn('[Lumina Webview]', msg, data || '');
                    vscode.postMessage({ type: 'log', level: 'warn', text: msg, data });
                },
                error: (msg, data) => {
                    console.error('[Lumina Webview]', msg, data || '');
                    vscode.postMessage({ type: 'log', level: 'error', text: msg, data });
                }
            };

            webviewLog.info('Webview script initialized for webview #' + webviewId);
            webviewLog.debug('JSON content length: ' + jsonContent.length + ' characters');

            async function initializeGraph() {
                const funcStartTime = performance.now();
                webviewLog.info('initializeGraph() called');

                try {
                    // Parse JSON to validate it
                    webviewLog.debug('Parsing JSON content...');
                    const parseStartTime = performance.now();
                    const parsedJson = JSON.parse(jsonContent);
                    const parseTime = (performance.now() - parseStartTime).toFixed(2);
                    webviewLog.info('JSON parsed successfully in ' + parseTime + 'ms');
                    webviewLog.debug('Parsed JSON type: ' + (Array.isArray(parsedJson) ? 'array' : typeof parsedJson));

                    // Import the blocks-graph library from CDN
                    webviewLog.info('Importing blocks-graph library from CDN...');
                    const importStartTime = performance.now();
                    const { BlocksGraph } = await import('https://cdn.jsdelivr.net/npm/@lumina-study/blocks-graph@0.1.3/+esm');
                    const importTime = (performance.now() - importStartTime).toFixed(2);
                    webviewLog.info('blocks-graph library imported successfully in ' + importTime + 'ms');
                    webviewLog.debug('BlocksGraph component available: ' + !!BlocksGraph);

                    // Clear loading message
                    webviewLog.debug('Clearing loading message...');
                    document.getElementById('root').innerHTML = '';

                    // Create blocks-graph element
                    webviewLog.debug('Creating blocks-graph element...');
                    const graph = document.createElement('blocks-graph');
                    graph.setAttribute('language', 'en');
                    graph.setAttribute('show-prerequisites', 'true');
                    graph.setAttribute('show-parents', 'true');
                    webviewLog.debug('blocks-graph attributes set: language=en, show-prerequisites=true, show-parents=true');

                    document.getElementById('root').appendChild(graph);
                    webviewLog.debug('blocks-graph element appended to DOM');

                    // Load the JSON data
                    webviewLog.info('Loading JSON data into graph...');
                    const loadStartTime = performance.now();
                    graph.loadFromJson(jsonContent, 'v0.1');
                    const loadTime = (performance.now() - loadStartTime).toFixed(2);
                    webviewLog.info('Graph loaded successfully in ' + loadTime + 'ms');

                    const totalTime = (performance.now() - funcStartTime).toFixed(2);
                    webviewLog.info('initializeGraph() completed in ' + totalTime + 'ms');

                    // Notify extension that graph is loaded
                    vscode.postMessage({
                        type: 'graphLoaded',
                        data: {
                            webviewId: webviewId,
                            parseTime: parseTime + 'ms',
                            importTime: importTime + 'ms',
                            loadTime: loadTime + 'ms',
                            totalTime: totalTime + 'ms'
                        }
                    });

                } catch (error) {
                    const errorTime = (performance.now() - funcStartTime).toFixed(2);
                    webviewLog.error('Error in initializeGraph() after ' + errorTime + 'ms: ' + (error.message || 'Unknown error'));
                    webviewLog.error('Error stack: ' + (error.stack || 'No stack trace'));

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
            webviewLog.debug('Checking document readyState: ' + document.readyState);
            if (document.readyState === 'loading') {
                webviewLog.debug('Document still loading, adding DOMContentLoaded listener');
                document.addEventListener('DOMContentLoaded', () => {
                    webviewLog.info('DOMContentLoaded event fired');
                    initializeGraph();
                });
            } else {
                webviewLog.debug('Document already loaded, calling initializeGraph immediately');
                initializeGraph();
            }

            // Notify extension that webview is ready
            const readyTime = (performance.now() - initStartTime).toFixed(2);
            webviewLog.info('Webview ready in ' + readyTime + 'ms');
            vscode.postMessage({ type: 'ready', data: { webviewId: webviewId, readyTime: readyTime + 'ms' } });
        </script>
    </body>
    </html>`
  }
}
