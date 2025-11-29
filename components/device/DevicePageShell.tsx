import type { ReactElement } from 'react'
import { ArrowUpRight, Star, StarHalf, StarOff } from 'lucide-react'

import Link from '@/components/objects/Link'
import type {
  DevicePageShellProps,
  DeviceStatGroup,
  StatItemProps,
  SectionsGridProps,
  SectionCardProps,
  SectionRowProps,
  RatingProps,
  StarState
} from '@/lib/types'
import { isExternalHref, externalLinkProps } from '@/lib/utils/styles'
import { iconSizes } from '@/lib/config/devices/config'

import DeviceHero from './DeviceHero'

export default function DevicePageShell({
  device
}: DevicePageShellProps): ReactElement {
  return (
    <div className="space-y-12">
      <DeviceHero device={device} />

      {device.stats.length || device.sections.length ? (
        <SectionsGrid stats={device.stats} sections={device.sections} />
      ) : null}
    </div>
  )
}

function SectionsGrid({
  stats,
  sections
}: {
  stats: DeviceStatGroup[]
  sections: SectionsGridProps['sections']
}): ReactElement {
  return (
    <section className="space-y-5">
      <div className="grid auto-rows-fr gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {stats.map((group) => (
          <StatCard key={group.title} group={group} />
        ))}
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </section>
  )
}

function StatCard({ group }: { group: DeviceStatGroup }): ReactElement {
  const Icon = group.icon

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
      <header className="flex items-center gap-3">
        {Icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <h3 className="text-lg font-semibold text-gray-100">{group.title}</h3>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {group.items.map((item) => (
          <StatItem
            key={`${group.title}-${item.label ?? item.value}`}
            item={item}
            groupIcon={group.icon}
          />
        ))}
      </div>
    </article>
  )
}

function StatItem({ item, groupIcon }: StatItemProps): ReactElement {
  const isExternal = isExternalHref(item.href)
  const linkProps = isExternal ? externalLinkProps : {}
  const baseClasses =
    'relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 px-4 py-5 text-gray-100 transition'
  const GroupIcon = groupIcon

  const content = (
    <>
      {GroupIcon ? (
        <GroupIcon
          aria-hidden
          className="pointer-events-none absolute -top-4 -right-4 text-gray-800/70"
          size={iconSizes.stat}
        />
      ) : null}
      {item.href && isExternal ? (
        <ArrowUpRight
          aria-hidden
          className="pointer-events-none absolute right-4 bottom-4 z-20 text-gray-500"
        />
      ) : null}
      <div className="relative z-10 space-y-2 pr-10">
        {item.label ? (
          <p className="text-xs tracking-wide text-gray-500 uppercase">
            {item.label}
          </p>
        ) : null}
        <div className="text-lg leading-snug font-semibold text-gray-100">
          {item.value}
        </div>
      </div>
    </>
  )

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={`${baseClasses} block hover:text-white hover:no-underline`}
        {...linkProps}
      >
        {content}
      </Link>
    )
  }

  return <div className={baseClasses}>{content}</div>
}

function SectionCard({ section }: SectionCardProps): ReactElement {
  const shouldSpanWide =
    !!section.paragraphs?.length &&
    (!section.rows || section.paragraphs.length > 1)

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm ${
        shouldSpanWide ? 'lg:col-span-2 xl:col-span-3' : ''
      }`}
    >
      <header className="flex items-center gap-3">
        {section.icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300">
            <section.icon className="h-5 w-5" />
          </span>
        ) : null}
        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {section.title}
          </h3>
          {section.rating ? <Rating rating={section.rating} /> : null}
        </div>
      </header>

      {section.rows?.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {section.rows.map((row) => (
            <SectionRow key={row.label} row={row} />
          ))}
        </div>
      ) : null}

      {section.listItems?.length ? (
        <ul className="grid gap-2 text-sm text-gray-300">
          {section.listItems.map((item) => {
            const isExternal = isExternalHref(item.href)
            const linkProps = isExternal ? externalLinkProps : {}
            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="relative block rounded-xl border border-gray-800 bg-gray-900/70 px-3 py-2 text-gray-100 transition hover:text-white hover:no-underline"
                    {...linkProps}
                  >
                    <span className="block pr-10 font-medium">
                      {item.label}
                    </span>
                    {isExternal ? (
                      <ArrowUpRight
                        aria-hidden
                        className="pointer-events-none absolute right-3 bottom-2.5 text-gray-500"
                      />
                    ) : null}
                  </Link>
                ) : (
                  <div className="rounded-xl border border-gray-800 bg-gray-900/70 px-3 py-2 text-gray-100">
                    <span className="font-medium">{item.label}</span>
                  </div>
                )}
                {item.description ? (
                  <p className="mt-1 text-xs text-gray-500">
                    {item.description}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}

      {section.paragraphs?.length ? (
        <div className="space-y-3 text-sm leading-relaxed text-gray-400">
          {section.paragraphs.map((paragraph) => (
            <p key={`${section.id}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function SectionRow({ row }: SectionRowProps): ReactElement {
  const { icon: RowIcon } = row
  const isExternal = isExternalHref(row.href)
  const linkProps = isExternal ? externalLinkProps : {}
  const baseClasses =
    'relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 px-4 py-5 text-gray-100 transition'

  const content = (
    <>
      {RowIcon ? (
        <RowIcon
          className="pointer-events-none absolute -top-4 -right-4 text-gray-800/70"
          size={iconSizes.section}
        />
      ) : null}
      {row.href && isExternal ? (
        <ArrowUpRight
          aria-hidden
          className="pointer-events-none absolute right-4 bottom-4 z-20 h-4 w-4 text-gray-500"
        />
      ) : null}
      <div className="relative z-10 space-y-2 pr-10">
        <p className="text-xs tracking-wide text-gray-500 uppercase">
          {row.label}
        </p>
        <div className="text-lg leading-snug font-semibold text-gray-100">
          {row.value}
        </div>
        {row.note ? <p className="text-xs text-gray-500">{row.note}</p> : null}
      </div>
    </>
  )

  if (row.href) {
    return (
      <Link
        href={row.href}
        className={`${baseClasses} block hover:text-white hover:no-underline`}
        {...linkProps}
      >
        {content}
      </Link>
    )
  }

  return <div className={baseClasses}>{content}</div>
}

function Rating({ rating }: RatingProps): ReactElement {
  const stars = buildStars(rating.value, rating.scale ?? 5)

  return (
    <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
      <span className="flex items-center text-gray-200">
        {stars.map((state, idx) => {
          const key = `${rating.label ?? rating.value}-${idx}`
          if (state === 'full') {
            return <Star key={key} className="fill-current" />
          }
          if (state === 'half') {
            return <StarHalf key={key} className="fill-current" />
          }
          return <StarOff key={key} className="text-gray-600" />
        })}
      </span>
      <span className="text-gray-300">{rating.value.toFixed(1)}</span>
      {rating.label ? (
        <span className="text-xs tracking-wide text-gray-600 uppercase">
          {rating.label}
        </span>
      ) : null}
    </div>
  )
}

function buildStars(value: number, scale: number): StarState[] {
  const stars: StarState[] = []
  const normalized = Math.max(0, Math.min(value, scale))
  for (let i = 1; i <= scale; i += 1) {
    if (normalized >= i) {
      stars.push('full')
    } else if (normalized > i - 1 && normalized < i) {
      stars.push('half')
    } else {
      stars.push('empty')
    }
  }
  return stars
}
