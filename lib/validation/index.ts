type Path = Array<string | number>

export interface ValidationIssue {
  path: string
  message: string
}

export type ValidationResult<T> =
  | { success: true; value: T }
  | { success: false; issues: ValidationIssue[] }

export class ValidationError extends Error {
  constructor(public issues: ValidationIssue[]) {
    super(formatIssues(issues))
    this.name = 'ValidationError'
  }
}

export interface Schema<T> {
  safeParse(value: unknown, path?: Path): ValidationResult<T>
  parse(value: unknown): T
}

type ValidatorFn<T> = (value: unknown, path: Path) => ValidationResult<T>

function createSchema<T>(validator: ValidatorFn<T>): Schema<T> {
  return {
    safeParse(value, path = []) {
      return validator(value, path)
    },
    parse(value) {
      const result = validator(value, [])
      if (result.success) {
        return result.value
      }
      throw new ValidationError(result.issues)
    }
  }
}

function success<T>(value: T): ValidationResult<T> {
  return { success: true, value }
}

function failure<T = never>(issues: ValidationIssue[]): ValidationResult<T> {
  return { success: false, issues }
}

function makeIssue(path: Path, message: string): ValidationIssue {
  return {
    path: pathToString(path),
    message
  }
}

function formatIssues(issues: ValidationIssue[]): string {
  if (issues.length === 0) return 'Validation failed'
  const detail = issues
    .map((issue) => `${issue.path}: ${issue.message}`)
    .join('\n')
  return `Validation failed:\n${detail}`
}

function pathToString(path: Path): string {
  if (path.length === 0) return '(root)'
  return path.reduce<string>((acc, segment, index) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`
    }
    if (index === 0 || acc === '') {
      return `${acc}${segment}`
    }
    return `${acc}.${segment}`
  }, '')
}

export interface StringSchemaOptions {
  minLength?: number
  trim?: boolean
}

export function string(options: StringSchemaOptions = {}): Schema<string> {
  return createSchema((value, path) => {
    if (typeof value !== 'string') {
      return failure([makeIssue(path, 'Expected string')])
    }

    const output = options.trim ? value.trim() : value

    if (options.minLength !== undefined && output.length < options.minLength) {
      return failure([
        makeIssue(path, `Expected string length ≥ ${options.minLength}`)
      ])
    }

    return success(output)
  })
}

export interface NumberSchemaOptions {
  min?: number
  max?: number
}

export function number(options: NumberSchemaOptions = {}): Schema<number> {
  return createSchema((value, path) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return failure([makeIssue(path, 'Expected number')])
    }

    if (options.min !== undefined && value < options.min) {
      return failure([makeIssue(path, `Expected number ≥ ${options.min}`)])
    }

    if (options.max !== undefined && value > options.max) {
      return failure([makeIssue(path, `Expected number ≤ ${options.max}`)])
    }

    return success(value)
  })
}

export function boolean(): Schema<boolean> {
  return createSchema((value, path) => {
    if (typeof value !== 'boolean') {
      return failure([makeIssue(path, 'Expected boolean')])
    }
    return success(value)
  })
}

export function anyValue<T = unknown>(): Schema<T> {
  return createSchema((value) => success(value as T))
}

export function literal<T extends string | number | boolean>(
  lit: T
): Schema<T> {
  return createSchema((value, path) => {
    if (value !== lit) {
      return failure([
        makeIssue(path, `Expected literal ${JSON.stringify(lit)}`)
      ])
    }
    return success(lit)
  })
}

export function enums<
  const Values extends ReadonlyArray<string | number | boolean>
>(values: Values): Schema<Values[number]> {
  return createSchema((value, path) => {
    if (!values.includes(value as never)) {
      return failure([
        makeIssue(
          path,
          `Expected one of ${values.map((v) => JSON.stringify(v)).join(', ')}`
        )
      ])
    }
    return success(value as Values[number])
  })
}

export function optional<T>(schema: Schema<T>): Schema<T | undefined> {
  return createSchema((value, path) => {
    if (value === undefined) {
      return success(undefined)
    }
    return schema.safeParse(value, path)
  })
}

export interface ArraySchemaOptions {
  minLength?: number
}

export function array<T>(
  schema: Schema<T>,
  options: ArraySchemaOptions = {}
): Schema<T[]> {
  return createSchema((value, path) => {
    if (!Array.isArray(value)) {
      return failure([makeIssue(path, 'Expected array')])
    }

    if (options.minLength !== undefined && value.length < options.minLength) {
      return failure([
        makeIssue(path, `Expected array length ≥ ${options.minLength}`)
      ])
    }

    const result: T[] = []
    const issues: ValidationIssue[] = []

    value.forEach((entry, index) => {
      const itemResult = schema.safeParse(entry, [...path, index])
      if (itemResult.success) {
        result.push(itemResult.value)
      } else {
        issues.push(...itemResult.issues)
      }
    })

    if (issues.length > 0) {
      return failure(issues)
    }

    return success(result)
  })
}

export function union<S extends ReadonlyArray<Schema<unknown>>>(
  schemas: S
): Schema<Infer<S[number]>> {
  return createSchema<Infer<S[number]>>((value, path) => {
    const collectedIssues: ValidationIssue[] = []

    for (const schema of schemas) {
      const result = schema.safeParse(value, path)
      if (result.success) {
        return success(result.value as Infer<S[number]>)
      }
      collectedIssues.push(...result.issues)
    }

    if (collectedIssues.length === 0) {
      collectedIssues.push(
        makeIssue(path, 'Value did not match any union type')
      )
    }

    return failure<Infer<S[number]>>(collectedIssues)
  })
}

export type Shape = Record<string, Schema<unknown>>

type Simplify<T> = { [K in keyof T]: T[K] }

type OptionalKeys<S extends Shape> = {
  [K in keyof S]-?: undefined extends Infer<S[K]> ? K : never
}[keyof S]

type ObjectResult<S extends Shape> = Simplify<
  {
    [K in Exclude<keyof S, OptionalKeys<S>>]: Infer<S[K]>
  } & {
    [K in OptionalKeys<S>]?: Infer<S[K]>
  }
>

export function object<S extends Shape>(shape: S): Schema<ObjectResult<S>> {
  return createSchema((value, path) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return failure([makeIssue(path, 'Expected object')])
    }

    const entries = value as Record<string, unknown>
    const result: Record<string, unknown> = {}
    const issues: ValidationIssue[] = []

    for (const key of Object.keys(shape) as Array<keyof S>) {
      const schema = shape[key]
      const fieldResult = schema.safeParse(entries[key as string], [
        ...path,
        key as string
      ])

      if (fieldResult.success) {
        result[key as string] = fieldResult.value
      } else {
        issues.push(...fieldResult.issues)
      }
    }

    if (issues.length > 0) {
      return failure(issues)
    }

    return success(result as ObjectResult<S>)
  })
}

export function refine<T>(
  schema: Schema<T>,
  refinement: (value: T) => void | string | ValidationIssue | ValidationIssue[]
): Schema<T> {
  return createSchema((value, path) => {
    const baseResult = schema.safeParse(value, path)
    if (!baseResult.success) {
      return baseResult
    }

    const feedback = refinement(baseResult.value)
    if (!feedback) {
      return baseResult
    }

    const issues: ValidationIssue[] = []
    if (typeof feedback === 'string') {
      issues.push(makeIssue(path, feedback))
    } else if (Array.isArray(feedback)) {
      issues.push(...feedback)
    } else {
      issues.push(feedback)
    }

    return failure(issues)
  })
}

export type Infer<S> = S extends Schema<infer T> ? T : never
