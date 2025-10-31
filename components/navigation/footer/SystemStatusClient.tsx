'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { getSystemHealthConfig } from '@/lib/config/status'
import { colors } from '@/lib/theme'
import type { SystemHealth } from '@/lib/types/status'
import { cn } from '@/lib/utils'

interface StatusResponse {
  overallHealth: SystemHealth
}

type StatusState =
  | { kind: 'loading' }
  | { kind: 'ready'; health: SystemHealth }
  | { kind: 'error' }

const STATUS_ENDPOINT = '/api/status'
const FETCH_TIMEOUT_MS = 5000

async function fetchStatus(): Promise<SystemHealth> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(STATUS_ENDPOINT, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`Unexpected response: ${response.status}`)
    }

    const data = (await response.json()) as StatusResponse
    return data.overallHealth
  } finally {
    clearTimeout(timeoutId)
  }
}

export default function SystemStatusClient() {
  const [state, setState] = useState<StatusState>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetchStatus()
      .then((health) => {
        if (!cancelled) {
          setState({ kind: 'ready', health })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ kind: 'error' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const content = useMemo(() => {
    if (state.kind === 'loading') {
      return {
        label: 'Checking status…',
        indicatorClass: 'bg-gray-500',
        textColor: colors.text.disabled
      }
    }

    if (state.kind === 'error') {
      return {
        label: 'Status unavailable',
        indicatorClass: 'bg-red-400',
        textColor: colors.accents.error
      }
    }

    const healthConfig = getSystemHealthConfig(state.health)

    const textColor =
      healthConfig.tone === 'positive'
        ? colors.text.disabled
        : healthConfig.tone === 'warning'
          ? colors.accents.warning
          : colors.accents.error

    return {
      label: healthConfig.label,
      indicatorClass: healthConfig.indicatorClass,
      textColor
    }
  }, [state])

  return (
    <div className="flex items-center justify-center space-x-4 text-sm sm:justify-end">
      <Link
        href="/status"
        className="flex items-center transition-opacity hover:opacity-80"
      >
        <span
          className={cn('mr-2 h-2 w-2 animate-pulse rounded-full', content.indicatorClass)}
        />
        <span style={{ color: content.textColor }}>{content.label}</span>
      </Link>
    </div>
  )
}
