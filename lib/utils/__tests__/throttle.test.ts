import { describe, expect, it, mock } from 'bun:test'
import { throttle } from '@/lib/utils'

describe('throttle', () => {
  it('should execute immediately on first call, then throttle subsequent calls', async () => {
    const fn = mock(() => {})
    const throttled = throttle(fn, 100)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should execute trailing call after delay', async () => {
    const fn = mock(() => {})
    const throttled = throttle(fn, 50)

    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    await Bun.sleep(60)

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should use latest arguments for trailing call', async () => {
    const fn = mock((value: string) => value)
    const throttled = throttle(fn, 50)

    throttled('first')
    throttled('second')
    throttled('third')

    expect(fn).toHaveBeenCalledWith('first')

    await Bun.sleep(60)

    expect(fn).toHaveBeenNthCalledWith(2, 'third')
  })

  it('should execute immediately again after delay passes', async () => {
    const fn = mock(() => {})
    const throttled = throttle(fn, 50)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    await Bun.sleep(60)

    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should pass multiple arguments correctly', async () => {
    const fn = mock((a: number, b: string, c: boolean) => {
      return { a, b, c }
    })
    const throttled = throttle(fn, 50)

    throttled(1, 'test', true)
    expect(fn).toHaveBeenCalledWith(1, 'test', true)

    throttled(2, 'update', false)
    await Bun.sleep(60)

    expect(fn).toHaveBeenNthCalledWith(2, 2, 'update', false)
  })

  it('should preserve this context', async () => {
    const fn = mock(function (this: unknown) {})

    const throttled = throttle(fn, 50)
    const context = { name: 'test-context' }

    throttled.call(context)

    expect(fn).toHaveBeenCalled()
    expect(fn.mock.contexts).toContain(context)
  })
})
