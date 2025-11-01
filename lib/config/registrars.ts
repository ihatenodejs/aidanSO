import { SiNamecheap, SiSpaceship } from 'react-icons/si'
import NameIcon from '@/components/icons/NameIcon'
import DynadotIcon from '@/components/icons/DynadotIcon'
import type { RegistrarConfig, DomainRegistrarId } from '@/lib/types'

/**
 * Domain registrar configurations.
 *
 * @module lib/config/registrars
 * @category Configuration
 * @public
 */

/**
 * Mapping of registrar IDs to their display configurations.
 *
 * @example
 * ```tsx
 * import { registrars } from '@/lib/config/registrars'
 *
 * const config = registrars.Namecheap
 * const Icon = config.icon
 *
 * return (
 *   <div>
 *     <Icon className={config.color} />
 *     <span>{config.name}</span>
 *   </div>
 * )
 * ```
 *
 * @public
 */
export const registrars: Record<DomainRegistrarId, RegistrarConfig> = {
  Spaceship: {
    name: 'Spaceship',
    icon: SiSpaceship,
    color: 'text-white'
  },
  Namecheap: {
    name: 'Namecheap',
    icon: SiNamecheap,
    color: 'text-orange-400'
  },
  'Name.com': {
    name: 'Name.com',
    icon: NameIcon,
    color: 'text-green-300'
  },
  Dynadot: {
    name: 'Dynadot',
    icon: DynadotIcon,
    color: 'text-blue-400'
  }
}
