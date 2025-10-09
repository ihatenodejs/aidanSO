/**
 * Validator utility class providing type-safe validation functions with TypeScript type guards.
 *
 * @remarks
 * This class contains static methods for validating various data types and formats.
 * Most methods use TypeScript type predicates for runtime type checking and compile-time
 * type narrowing.
 *
 * @example
 * ```ts
 * import { Validator } from '@/lib/utils'
 *
 * // Validate and narrow types
 * if (Validator.isValidDate(value)) {
 *   // TypeScript knows value is Date here
 *   console.log(value.getTime())
 * }
 *
 * // Validate strings
 * const isValid = Validator.isValidEmail('user@example.com') // true
 *
 * // Validate ranges
 * const inRange = Validator.isInRange(50, 0, 100) // true
 * ```
 *
 * @category Utils
 * @public
 */
export class Validator {
  /**
   * Validates that a value is a valid Date object with a valid timestamp.
   *
   * @param date - Value to check
   * @returns Type predicate indicating if value is a valid Date
   *
   * @remarks
   * Checks both that the value is a Date instance and that its internal
   * timestamp is not NaN (which can occur with invalid date strings).
   *
   * @example
   * ```ts
   * Validator.isValidDate(new Date())              // true
   * Validator.isValidDate(new Date('2025-01-15'))  // true
   * Validator.isValidDate(new Date('invalid'))     // false
   * Validator.isValidDate('2025-01-15')            // false
   * Validator.isValidDate(null)                    // false
   * ```
   *
   * @public
   */
  static isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime())
  }

  /**
   * Validates that a string is a properly formatted URL.
   *
   * @param url - String to validate as URL
   * @returns True if the string is a valid URL, false otherwise
   *
   * @remarks
   * Uses the built-in URL constructor to validate format. Accepts any protocol
   * (http, https, ftp, etc.) and properly formatted URLs.
   *
   * @example
   * ```ts
   * Validator.isValidUrl('https://example.com')       // true
   * Validator.isValidUrl('http://localhost:3000')     // true
   * Validator.isValidUrl('ftp://files.example.com')   // true
   * Validator.isValidUrl('example.com')               // false (no protocol)
   * Validator.isValidUrl('not a url')                 // false
   * ```
   *
   * @public
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Validates that a string matches a basic email format.
   *
   * @param email - String to validate as email address
   * @returns True if the string matches email format, false otherwise
   *
   * @remarks
   * Uses a basic regex pattern that checks for:
   * - Non-whitespace characters before @
   * - Non-whitespace characters after @
   * - A dot followed by non-whitespace characters (TLD)
   *
   * Note: This is a basic format check and may not catch all invalid emails
   * or allow all technically valid ones. For production use, consider more
   * robust validation or server-side verification.
   *
   * @example
   * ```ts
   * Validator.isValidEmail('user@example.com')     // true
   * Validator.isValidEmail('test.user@domain.co')  // true
   * Validator.isValidEmail('invalid.email')        // false
   * Validator.isValidEmail('missing@domain')       // false
   * Validator.isValidEmail('@example.com')         // false
   * ```
   *
   * @public
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validates that a string matches a valid domain name format.
   *
   * @param domain - String to validate as domain name
   * @returns True if the string is a valid domain format, false otherwise
   *
   * @remarks
   * Validates domain names according to standard rules:
   * - Only alphanumeric characters and hyphens
   * - Cannot start or end with hyphen
   * - Maximum 63 characters per label
   * - Case insensitive
   *
   * Accepts both top-level domains and subdomains.
   *
   * @example
   * ```ts
   * Validator.isValidDomain('example.com')         // true
   * Validator.isValidDomain('subdomain.example.com') // true
   * Validator.isValidDomain('test-site.dev')       // true
   * Validator.isValidDomain('Example.COM')         // true (case insensitive)
   * Validator.isValidDomain('-invalid.com')        // false
   * Validator.isValidDomain('invalid-.com')        // false
   * Validator.isValidDomain('has space.com')       // false
   * ```
   *
   * @public
   */
  static isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i
    return domainRegex.test(domain)
  }

  /**
   * Validates that a number falls within a specified range (inclusive).
   *
   * @param value - Number to check
   * @param min - Minimum allowed value (inclusive)
   * @param max - Maximum allowed value (inclusive)
   * @returns True if value is between min and max (inclusive), false otherwise
   *
   * @example
   * ```ts
   * Validator.isInRange(50, 0, 100)    // true
   * Validator.isInRange(0, 0, 100)     // true (inclusive)
   * Validator.isInRange(100, 0, 100)   // true (inclusive)
   * Validator.isInRange(-1, 0, 100)    // false
   * Validator.isInRange(101, 0, 100)   // false
   * ```
   *
   * @public
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  /**
   * Validates that an object contains all required keys.
   *
   * @template T - The expected object type
   * @param obj - Value to check
   * @param keys - Array of required keys
   * @returns Type predicate indicating if obj has all required keys
   *
   * @remarks
   * This is a type guard that performs runtime validation while also narrowing
   * the TypeScript type. It only checks for key presence, not value types.
   *
   * @example
   * ```ts
   * interface User {
   *   name: string
   *   email: string
   *   age: number
   * }
   *
   * const data: unknown = { name: 'Alice', email: 'alice@example.com', age: 30 }
   *
   * if (Validator.hasRequiredKeys<User>(data, ['name', 'email', 'age'])) {
   *   // TypeScript knows data is User here
   *   console.log(data.name) // OK
   * }
   * ```
   *
   * @public
   */
  static hasRequiredKeys<T extends object>(
    obj: unknown,
    keys: (keyof T)[]
  ): obj is T {
    if (typeof obj !== 'object' || obj === null) return false
    return keys.every(key => key in obj)
  }

  /**
   * Validates that a value is a non-empty string (after trimming).
   *
   * @param value - Value to check
   * @returns Type predicate indicating if value is a non-empty string
   *
   * @remarks
   * Trims whitespace before checking length, so strings with only whitespace
   * are considered empty.
   *
   * @example
   * ```ts
   * Validator.isNonEmptyString('hello')      // true
   * Validator.isNonEmptyString(' text ')     // true
   * Validator.isNonEmptyString('')           // false
   * Validator.isNonEmptyString('   ')        // false (whitespace only)
   * Validator.isNonEmptyString(123)          // false
   * Validator.isNonEmptyString(null)         // false
   * ```
   *
   * @public
   */
  static isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0
  }

  /**
   * Validates that a value is a positive number (> 0) and not NaN.
   *
   * @param value - Value to check
   * @returns Type predicate indicating if value is a positive number
   *
   * @remarks
   * Checks for:
   * - Type is number
   * - Value is greater than 0 (not equal to 0)
   * - Value is not NaN
   *
   * @example
   * ```ts
   * Validator.isPositiveNumber(5)        // true
   * Validator.isPositiveNumber(0.1)      // true
   * Validator.isPositiveNumber(0)        // false
   * Validator.isPositiveNumber(-5)       // false
   * Validator.isPositiveNumber(NaN)      // false
   * Validator.isPositiveNumber('5')      // false
   * ```
   *
   * @public
   */
  static isPositiveNumber(value: unknown): value is number {
    return typeof value === 'number' && value > 0 && !isNaN(value)
  }

  /**
   * Validates that a value is an array, optionally validating each item.
   *
   * @template T - The expected item type
   * @param value - Value to check
   * @param itemValidator - Optional validator function for array items
   * @returns Type predicate indicating if value is an array of type T
   *
   * @remarks
   * - Without itemValidator: Only checks if value is an array
   * - With itemValidator: Checks if value is an array AND all items pass validation
   *
   * @example
   * ```ts
   * // Basic array check
   * Validator.isArray([1, 2, 3])           // true
   * Validator.isArray('not array')         // false
   *
   * // With item validation
   * Validator.isArray([1, 2, 3], (item): item is number => typeof item === 'number')  // true
   * Validator.isArray([1, '2', 3], (item): item is number => typeof item === 'number') // false
   *
   * // With type narrowing
   * const value: unknown = ['a', 'b', 'c']
   * if (Validator.isArray<string>(value, (item): item is string => typeof item === 'string')) {
   *   // TypeScript knows value is string[] here
   *   value.map(s => s.toUpperCase())
   * }
   * ```
   *
   * @public
   */
  static isArray<T>(value: unknown, itemValidator?: (item: unknown) => item is T): value is T[] {
    if (!Array.isArray(value)) return false
    if (!itemValidator) return true
    return value.every(itemValidator)
  }
}