import { describe, expect, it } from 'bun:test'
import { isExpired, isExpiringSoon } from '@/lib/domains/utils'
import { DomainService } from '@/lib/services/domain.service'
import type { Domain } from '@/lib/types'

const createMockDomain = (overrides: Partial<Domain> = {}): Domain => ({
  domain: 'example.com',
  usage: 'Test Domain',
  registrar: 'Namecheap',
  autoRenew: false,
  status: 'active',
  category: 'personal',
  tags: ['test'],
  renewals: [{ date: '2020-01-01', years: 1 }],
  ...overrides
})

describe('domain expiration utilities', () => {
  it('identifies expired domains correctly', () => {
    // Expired in 2021
    const expiredDomain = createMockDomain({
      renewals: [{ date: '2020-01-01', years: 1 }]
    })
    expect(isExpired(expiredDomain)).toBe(true)

    // Expires far in the future (2036)
    const activeDomain = createMockDomain({
      renewals: [{ date: '2026-01-01', years: 10 }]
    })
    expect(isExpired(activeDomain)).toBe(false)
  })

  it('identifies domains expiring soon while excluding expired domains', () => {
    const now = new Date()

    // Expired domain: expiration date in past
    const expiredDomain = createMockDomain({
      renewals: [{ date: '2020-01-01', years: 1 }]
    })
    expect(isExpiringSoon(expiredDomain)).toBe(false)

    // Expiring soon domain: expires in 30 days
    const futureDate30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiringSoonDomain = createMockDomain({
      renewals: [
        {
          date: `${futureDate30Days.getFullYear() - 1}-${String(
            futureDate30Days.getMonth() + 1
          ).padStart(2, '0')}-${String(futureDate30Days.getDate()).padStart(
            2,
            '0'
          )}`,
          years: 1
        }
      ]
    })
    expect(isExpired(expiringSoonDomain)).toBe(false)
    expect(isExpiringSoon(expiringSoonDomain)).toBe(true)

    // Not expiring soon: expires in 200 days
    const futureDate200Days = new Date(
      now.getTime() + 200 * 24 * 60 * 60 * 1000
    )
    const longTermDomain = createMockDomain({
      renewals: [
        {
          date: `${futureDate200Days.getFullYear() - 1}-${String(
            futureDate200Days.getMonth() + 1
          ).padStart(2, '0')}-${String(futureDate200Days.getDate()).padStart(
            2,
            '0'
          )}`,
          years: 1
        }
      ]
    })
    expect(isExpired(longTermDomain)).toBe(false)
    expect(isExpiringSoon(longTermDomain)).toBe(false)
  })

  it('computes expired and expiringSoon counts in DomainService.getDomainStats()', () => {
    const stats = DomainService.getDomainStats()
    expect(typeof stats.expired).toBe('number')
    expect(typeof stats.expiringSoon).toBe('number')
    expect(stats.expired).toBeGreaterThanOrEqual(0)
    expect(stats.expiringSoon).toBeGreaterThanOrEqual(0)
  })

  it('caps ownership duration at expiration date for expired domains', () => {
    // Domain registered 2020-01-01 for 1 year (expired 2021-01-01)
    const expiredDomain = createMockDomain({
      renewals: [{ date: '2020-01-01', years: 1 }]
    })
    const enriched = DomainService.enrichDomain(expiredDomain)
    // Ownership should be capped at 1 year (approx 366 days / 12 months)
    expect(enriched.ownershipYears).toBe(1)
    expect(enriched.ownershipMonths).toBe(12)
    expect(enriched.ownershipDays).toBe(366)
  })
})
