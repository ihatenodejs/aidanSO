'use client'

import { useEffect } from 'react'

export default function AnimatedTitle() {
  useEffect(() => {
    const title = 'aidan.so'
    let index = 1
    let forward = true
    const interval = setInterval(() => {
      document.title = title.substring(0, index)
      if (forward) {
        index++
        if (index > title.length) {
          forward = false
          index = title.length - 1
        }
      } else {
        index--
        if (index < 1) {
          forward = true
          index = 1
        }
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return null
}
