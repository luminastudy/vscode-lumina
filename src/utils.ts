import { getLogger } from './logger'

const CONTEXT = 'Utils'

/**
 * Validates if a string is valid JSON
 */
export function isValidJson(str: string): boolean {
  const logger = getLogger()
  logger.debug(
    `isValidJson called with string of length ${str.length}`,
    CONTEXT
  )

  try {
    JSON.parse(str)
    logger.debug('JSON validation successful', CONTEXT)
    return true
  } catch (error) {
    logger.debug(
      `JSON validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      CONTEXT
    )
    return false
  }
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T = unknown>(
  str: string
): { success: true; data: T } | { success: false; error: string } {
  const logger = getLogger()
  logger.debug(
    `safeJsonParse called with string of length ${str.length}`,
    CONTEXT
  )

  try {
    const parseStart = Date.now()
    const data = JSON.parse(str) as T
    const parseTime = Date.now() - parseStart
    logger.debug(`JSON parsed successfully in ${parseTime}ms`, CONTEXT)
    logger.debug(
      `Parsed data type: ${Array.isArray(data) ? 'array' : typeof data}`,
      CONTEXT
    )
    return { success: true, data }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    logger.warn(`JSON parse failed: ${errorMessage}`, CONTEXT)
    return {
      success: false,
      error: errorMessage,
    }
  }
}
