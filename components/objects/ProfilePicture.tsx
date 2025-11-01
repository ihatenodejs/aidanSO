import Image from 'next/image'
import { cn } from '@/lib/utils'

type BorderWidth = '0' | '1' | '2' | '4' | '8'

interface ProfilePictureProps {
  src?: string
  alt?: string
  size?: number
  borderWidth?: BorderWidth
  className?: string
}

const getBorderClass = (width: BorderWidth): string => {
  const borderClasses: Record<BorderWidth, string> = {
    '0': 'border-0',
    '1': 'border',
    '2': 'border-2',
    '4': 'border-4',
    '8': 'border-8'
  }
  return borderClasses[width]
}

export default function ProfilePicture({
  src = '/ihatenodejs.jpg',
  alt = "Aidan's Profile Picture",
  size = 150,
  borderWidth = '2',
  className
}: ProfilePictureProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn(
        'rounded-full border-gray-700 transition-colors duration-300 hover:border-gray-600',
        getBorderClass(borderWidth),
        className
      )}
    />
  )
}
