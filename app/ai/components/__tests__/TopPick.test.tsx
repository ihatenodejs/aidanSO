import { describe, expect, test } from 'bun:test'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import TopPick from '../TopPick'

describe('TopPick Component', () => {
  test('renders Mid 2026 default pick with Oh My Pi recommendation', () => {
    const html = ReactDOMServer.renderToString(React.createElement(TopPick))

    // Default period Mid 2026 should be rendered
    expect(html).toContain('Mid 2026')
    expect(html).toContain('Top Pick of')
    expect(html).toContain('Oh My Pi')
    expect(html).toContain('https://omp.sh/')

    // Left chevron (Previous year) should be present on default Mid 2026
    expect(html).toContain('aria-label="Previous year"')

    // Right chevron (Next year) should NOT be present on latest period Mid 2026
    expect(html).not.toContain('aria-label="Next year"')
  })
})
