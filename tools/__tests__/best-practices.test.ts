import { describe, expect, it, mock } from 'bun:test'

import type { CheckDefinition } from '../best-practices/types'
import {
  isSupportedModule,
  isValidCheckDefinition,
  loadRegistry,
  parseCliArguments,
  resolveChecksToRun,
  runChecks
} from '../best-practices'

const createCheck = (
  id: string,
  runImplementation: CheckDefinition['run']
): CheckDefinition => ({
  id,
  description: `${id} description`,
  run: runImplementation
})

describe('parseCliArguments', () => {
  it('parses supported flags and check selections', () => {
    const result = parseCliArguments([
      '--list',
      '--json',
      '--only=alpha,beta',
      '--only=gamma',
      '--skip=delta,epsilon',
      '--skip=zeta'
    ])

    expect(result.helpRequested).toBeFalse()
    expect(result.errors).toHaveLength(0)
    expect(result.options.listOnly).toBeTrue()
    expect(result.options.format).toBe('json')
    expect(Array.from(result.options.selectedChecks)).toEqual([
      'alpha',
      'beta',
      'gamma'
    ])
    expect(Array.from(result.options.skippedChecks)).toEqual([
      'delta',
      'epsilon',
      'zeta'
    ])
  })

  it('records unknown arguments and help flag', () => {
    const result = parseCliArguments(['--help', '--wat'])

    expect(result.helpRequested).toBeTrue()
    expect(result.errors).toEqual(['Unknown argument: --wat'])
  })
})

describe('module helpers', () => {
  it('recognises supported module extensions', () => {
    expect(isSupportedModule('check.ts')).toBeTrue()
    expect(isSupportedModule('check.cjs')).toBeTrue()
    expect(isSupportedModule('readme.md')).toBeFalse()
  })

  it('validates check definitions', () => {
    const validCheck: CheckDefinition = createCheck('ok', async () => ({
      id: 'ok',
      ok: true,
      messages: []
    }))

    expect(isValidCheckDefinition(validCheck)).toBeTrue()
    expect(isValidCheckDefinition({})).toBeFalse()
    expect(
      isValidCheckDefinition({
        id: 'missing-run',
        description: 'no run property'
      })
    ).toBeFalse()
  })
})

describe('check resolution', () => {
  const registry: CheckDefinition[] = [
    createCheck('first', async () => ({
      id: 'first',
      ok: true,
      messages: ['first passed']
    })),
    createCheck('second', async () => ({
      id: 'second',
      ok: true,
      messages: ['second passed']
    }))
  ]

  it('returns all checks when none are specified', () => {
    const checks = resolveChecksToRun(new Set(), new Set(), registry)
    expect(checks).toHaveLength(2)
    expect(checks[0].id).toBe('first')
    expect(checks[1].id).toBe('second')
  })

  it('filters checks and reports unknown ids', () => {
    const errorSpy = mock(() => {})
    const originalError = console.error

    console.error = errorSpy
    try {
      const checks = resolveChecksToRun(
        new Set(['second', 'unknown']),
        new Set(),
        registry
      )
      expect(checks).toHaveLength(1)
      expect(checks[0].id).toBe('second')
      expect(errorSpy).toHaveBeenCalledWith('Unknown check id: unknown')
    } finally {
      console.error = originalError
    }
  })

  it('skips requested checks and reports unknown skip ids', () => {
    const errorSpy = mock(() => {})
    const originalError = console.error

    console.error = errorSpy
    try {
      const checks = resolveChecksToRun(
        new Set(),
        new Set(['first', 'missing']),
        registry
      )
      expect(checks).toHaveLength(1)
      expect(checks[0].id).toBe('second')
      expect(errorSpy).toHaveBeenCalledWith('Unknown check id to skip: missing')
    } finally {
      console.error = originalError
    }
  })
})

describe('runChecks', () => {
  it('collects results and captures thrown errors', async () => {
    const successful = createCheck('success', async () => ({
      id: 'success',
      ok: true,
      messages: ['all good']
    }))
    const failing = createCheck('failure', async () => {
      throw new Error('boom')
    })

    const results = await runChecks([successful, failing])
    expect(results).toHaveLength(2)

    const okResult = results.find((result) => result.id === 'success')
    expect(okResult?.ok).toBeTrue()
    expect(okResult?.messages).toEqual(['all good'])

    const errorResult = results.find((result) => result.id === 'failure')
    expect(errorResult?.ok).toBeFalse()
    expect(errorResult?.messages[0]).toBe('boom')
  })
})

describe('loadRegistry', () => {
  it('loads available checks from disk', async () => {
    const registry = await loadRegistry()
    expect(registry.length).toBeGreaterThan(0)

    const ids = new Set(registry.map((check) => check.id))
    expect(ids.has('ai-config-validator')).toBeTrue()
    expect(ids.has('cc-model-labels')).toBeTrue()
  })
})
