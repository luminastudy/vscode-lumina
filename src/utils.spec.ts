import { describe, it, expect } from 'vitest'
import { isValidJson, safeJsonParse } from './utils'

describe('utils', () => {
  describe('isValidJson', () => {
    it('should return true for valid JSON string', () => {
      expect(isValidJson('{"name": "test"}')).toBe(true)
    })

    it('should return true for valid JSON array', () => {
      expect(isValidJson('[1, 2, 3]')).toBe(true)
    })

    it('should return false for invalid JSON', () => {
      expect(isValidJson('{name: "test"}')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidJson('')).toBe(false)
    })

    it('should return true for simple values', () => {
      expect(isValidJson('123')).toBe(true)
      expect(isValidJson('"string"')).toBe(true)
      expect(isValidJson('true')).toBe(true)
    })
  })

  describe('safeJsonParse', () => {
    it('should successfully parse valid JSON', () => {
      const result = safeJsonParse<{ name: string }>('{"name": "test"}')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ name: 'test' })
      }
    })

    it('should return error for invalid JSON', () => {
      const result = safeJsonParse('{invalid}')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeTruthy()
      }
    })

    it('should handle arrays', () => {
      const result = safeJsonParse<number[]>('[1, 2, 3]')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual([1, 2, 3])
      }
    })

    it('should handle primitive values', () => {
      const stringResult = safeJsonParse<string>('"hello"')
      expect(stringResult.success).toBe(true)
      if (stringResult.success) {
        expect(stringResult.data).toBe('hello')
      }

      const numberResult = safeJsonParse<number>('42')
      expect(numberResult.success).toBe(true)
      if (numberResult.success) {
        expect(numberResult.data).toBe(42)
      }
    })
  })
})
