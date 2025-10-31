'use client'

import { useCallback, useEffect, useRef } from 'react'

export default function TypeDocIframe() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const updateHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc =
      iframe.contentDocument || iframe.contentWindow?.document || undefined

    if (!doc) return

    const { body, documentElement } = doc
    const newHeight = Math.max(
      body?.scrollHeight ?? 0,
      body?.offsetHeight ?? 0,
      documentElement?.clientHeight ?? 0,
      documentElement?.scrollHeight ?? 0,
      documentElement?.offsetHeight ?? 0
    )

    if (newHeight > 0) {
      iframe.style.height = `${newHeight}px`
    }
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      cleanupRef.current?.()
      updateHeight()

      const iframeWindow = iframe.contentWindow
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document || undefined

      if (iframeDoc) {
        applyScrollEnhancements(iframeDoc)
      }

      const resizeHandler = () => updateHeight()
      const hostResizeHandler = () => updateHeight()
      let observer: ResizeObserver | undefined

      if (iframeWindow) {
        iframeWindow.addEventListener('resize', resizeHandler)
      }
      window.addEventListener('resize', hostResizeHandler)

      if (iframeDoc?.body && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => updateHeight())
        observer.observe(iframeDoc.body)
      }

      requestAnimationFrame(() => updateHeight())
      setTimeout(() => updateHeight(), 250)

      cleanupRef.current = () => {
        if (iframeWindow) {
          iframeWindow.removeEventListener('resize', resizeHandler)
        }
        window.removeEventListener('resize', hostResizeHandler)
        observer?.disconnect()
        cleanupRef.current = null
      }
    }

    iframe.addEventListener('load', handleLoad)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      cleanupRef.current?.()
    }
  }, [updateHeight])

  return (
    <div className="flex w-full flex-1 flex-col">
      <iframe
        ref={iframeRef}
        title="TypeDoc Documentation"
        src="/docs/html/index.html"
        className="w-full border-0 bg-transparent"
        style={{
          minHeight: '80vh',
          width: '100%',
          display: 'block'
        }}
        loading="lazy"
      />
    </div>
  )
}

function applyScrollEnhancements(doc: Document) {
  const root = doc.documentElement
  const body = doc.body

  root.style.scrollBehavior = 'smooth'
  root.style.setProperty('scrollbar-gutter', 'stable both-edges')

  if (body) {
    body.style.setProperty('overscroll-behavior', 'contain')
    body.style.setProperty('-webkit-overflow-scrolling', 'touch')
  }

  if (!doc.getElementById('aidxn-typedoc-scroll-style')) {
    const styleEl = doc.createElement('style')
    styleEl.id = 'aidxn-typedoc-scroll-style'
    styleEl.textContent = `
      :root {
        scroll-behavior: smooth;
      }

      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: rgba(107, 114, 128, 0.6);
        border-radius: 9999px;
        border: 3px solid transparent;
        background-clip: content-box;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.75);
      }

      ::-webkit-scrollbar-track {
        background-color: rgba(31, 41, 55, 0.6);
      }
    `
    doc.head?.appendChild(styleEl)
  }
}
