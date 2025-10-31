import { describe, expect, test } from 'bun:test'

import {
  FOOTER_CONTACT_LINK_IDS,
  FOOTER_DONATION_GROUP_IDS
} from '@/components/navigation/footer'
import { contactLinks } from '@/lib/config/contact'
import { donationGroups } from '@/lib/config/donations'

describe('Footer configuration', () => {
  test('footer contact IDs map to defined contact links', () => {
    const definedContactIds = new Set(contactLinks.map((link) => link.id))

    for (const contactId of FOOTER_CONTACT_LINK_IDS) {
      expect(definedContactIds.has(contactId)).toBeTrue()
    }
  })

  test('footer donation group IDs map to defined donation groups', () => {
    const definedDonationGroupIds = new Map(
      donationGroups.map((group) => [group.id, group])
    )

    for (const groupId of FOOTER_DONATION_GROUP_IDS) {
      const group = definedDonationGroupIds.get(groupId)

      expect(group).toBeDefined()
      expect(group?.links.length ?? 0).toBeGreaterThan(0)
    }
  })
})
