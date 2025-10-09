"use client"

import Image from 'next/image'
import { useState } from 'react'

interface GitHubStatsImageProps {
  username: string
}

export default function GitHubStatsImage({ username }: GitHubStatsImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) { return null }

  return (
    <div className="flex flex-col justify-center items-center w-full mt-4 gap-4">
      <Image
        src={`https://github-readme-stats.vercel.app/api?username=${username}&theme=dark&show_icons=true&hide_border=true&count_private=true`}
        alt={`${username}'s Stats`}
        width={420}
        height={200}
        onError={() => setImageError(true)}
        loading="eager"
        priority
        unoptimized
        className="max-w-full h-auto"
      />
      <Image
        src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=dark&show_icons=true&hide_border=true&layout=compact`}
        alt={`${username}'s Top Languages`}
        width={300}
        height={200}
        onError={() => setImageError(true)}
        loading="eager"
        priority
        unoptimized
        className="max-w-full h-auto"
      />
    </div>
  )
}