import Link from 'next/link'
import { footerMessages } from './footerMessages'

/**
 * @public
 */
export interface RandomFooterMsgProps {
  index?: number
}

export default function RandomFooterMsg({ index = 0 }: RandomFooterMsgProps) {
  if (!footerMessages.length) {
    return null
  }

  const safeIndex =
    ((Math.floor(index) % footerMessages.length) + footerMessages.length) %
    footerMessages.length
  const message = footerMessages[safeIndex]

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
