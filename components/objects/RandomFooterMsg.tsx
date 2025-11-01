'use client'

import Link from 'next/link'
import { footerMessages } from './footerMessages'

interface RandomFooterMsgProps {
  index?: number
}

const fallbackMessage = footerMessages[0] ?? null

const getMessageByIndex = (index: number | undefined) => {
  if (!footerMessages.length) {
    return null
  }

  if (typeof index !== 'number' || Number.isNaN(index)) {
    return fallbackMessage
  }

  const safeIndex =
    ((Math.floor(index) % footerMessages.length) + footerMessages.length) %
    footerMessages.length
  return footerMessages[safeIndex] ?? fallbackMessage
}

export default function RandomFooterMsg({ index }: RandomFooterMsgProps) {
  const message = getMessageByIndex(index)

  if (!message) {
    return null
  }

  const { text, url, Icon } = message

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-2 transition-colors hover:text-white sm:mb-0"
    >
      <div className="flex items-center justify-center">
        <Icon className="text-md mr-2" />
        {text}
      </div>
    </Link>
  )
}
