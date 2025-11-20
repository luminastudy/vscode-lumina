/**
 * Utility functions for the extension
 */

/**
 * Validates if a string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T = unknown>(
  str: string
): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = JSON.parse(str) as T
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
