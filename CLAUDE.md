# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the aidxnCC codebase.

## Project Overview

**aidxnCC** is a personal portfolio and services website built with Next.js 15, featuring real-time music tracking, domain management, device showcases, and AI usage analytics.

### Tech Stack

- **Runtime**: Bun (not Node.js) - all scripts use `bun run`
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom theme system
- **Server**: Custom Bun server with Socket.io
- **UI Libraries**: Some Shadcn UI Components, Lucide Icons, React Icons
- **Data Visualization**: Recharts
- **Internationalization**: i18next with React bindings

## Development Commands

```bash
# Development - runs custom server with Socket.io
bun run dev

# Production build and start
bun run build
bun run start

# Linting
bun run lint
```

Do not run a development server unless you are specifically asked to. There are better methods to check for issues with your modifications, such as checking the IDE issues or using the lint script.

## Project Architecture

### Directory Structure

```
/app                  # Next.js App Router pages
  /about              # About page
  /ai                 # AI tools and usage analytics
    /usage            # Claude usage tracking components
  /contact            # Contact page
  /device             # Device showcase pages (dynamic)
  /domains            # Domain portfolio management
  /manifesto          # Personal manifesto page
  /api                # API routes
    /now-playing      # Music tracking endpoint

/components           # Reusable React components
  /device             # Device-specific components
  /domains            # Domain management components
  /icons              # Custom icon components
  /objects            # Common UI elements (IMPORTANT - reuse these!)
  /ui                 # Base UI components
  /widgets            # Feature-specific widgets

/lib                  # Core application logic (IMPORTANT - always use these utilities!)
  /devices            # Device data and configuration
  /domains            # Domain data and utilities
  /services           # Business logic services
  /theme              # Theme system and design tokens
  /types              # TypeScript type definitions
  /utils              # Utility functions

/public               # Static assets
  /data               # JSON data files
  /img                # Images
  /locales            # i18n translation files
```

## Critical Reusable Components & Utilities

### ALWAYS Use These Existing Utilities

#### 1. Class Name Merging (`lib/utils.ts`)

```typescript
import { cn } from '@/lib/utils'

// ALWAYS use cn() for combining Tailwind classes
className={cn('base-class', conditional && 'conditional-class', className)}
```

#### 2. Formatting Utilities (`lib/utils/formatting.ts`)

```typescript
import { Formatter } from '@/lib/utils'

// Available formatters:
Formatter.currency(value, decimals) // $100.00
Formatter.tokens(value) // 1.5M, 2.3K
Formatter.percentage(value, decimals) // 85.5%
Formatter.date(date, format) // 'short', 'long', 'iso'
Formatter.duration(days) // 2y, 3mo, 5d
Formatter.fileSize(bytes) // 1.5 MB
Formatter.number(value, decimals) // 1,234.56
Formatter.capitalize(str) // Title Case
Formatter.truncate(str, maxLength) // Text...
Formatter.slugify(str) // url-friendly-slug
```

#### 3. Theme System (`lib/theme/`)

**Colors (`lib/theme/colors.ts`)**

```typescript
import { colors } from '@/lib/theme/colors'

// Color tokens:
colors.gray // 50-950 scale
colors.backgrounds // pageGradientStart, pageGradientEnd, card, hover
colors.borders // default, hover, subtle, muted
colors.text // primary, secondary, body, muted, disabled
colors.accents // link, linkHover, ai, success, warning, error
```

**Surfaces (`lib/theme/surfaces.ts`)**

```typescript
import { surfaces } from '@/lib/theme/surfaces'

surfaces.card.default // Standard card styling
surfaces.card.domain // Domain-specific card
surfaces.card.ai // AI theme card
surfaces.card.featured // Featured/highlighted card
surfaces.section.default // Section container
surfaces.button.nav // Navigation button
surfaces.button.primary // Primary CTA button
surfaces.badge.default // Badge styling
surfaces.spacing.page // Page-level spacing
```

#### 4. Common Components (`components/objects/`)

**Link Component**

```typescript
import Link from '@/components/objects/Link'

<Link
  href="/path"
  variant="default|nav|muted"
  external={true}  // Auto-adds target="_blank" and rel="noopener"
>
```

**Button Component**

```typescript
import Button from '@/components/objects/Button'

<Button
  href="/path"
  variant="primary|rounded"
  icon={<IconComponent />}
  target="_blank"  // Optional
>
```

**AnimatedTitle Component**

```typescript
import AnimatedTitle from '@/components/objects/AnimatedTitle'

<AnimatedTitle text="Page Title" />
```

#### 5. Services Pattern (`lib/services/`)

```typescript
import { DomainService, DeviceService, AIService } from '@/lib/services'

// Domain operations
const domains = DomainService.getAllDomainsEnriched()
const domain = DomainService.getDomainByName('example.com')
const filtered = DomainService.filterDomains({ status: 'active' })
const stats = DomainService.getDomainStats()

// Device operations
const devices = DeviceService.getAllDevices()
const device = DeviceService.getDeviceBySlug('device-slug')

// AI operations
const usage = AIService.getUsageData()
```

#### 6. Type Definitions (`lib/types/`)

```typescript
import type {
  Domain,
  DomainWithMetrics,
  Device,
  AIModel,
  DateRange,
  SortOrder,
  PaginationConfig
} from '@/lib/types'
```

## Styling Guidelines

### Tailwind CSS v4 Configuration

1. **CSS Variables**: Colors use CSS variables defined in globals.css
2. **Dark Mode**: Uses class-based dark mode (`dark:` prefix)
3. **Custom Utilities**:
   - `.glow` - Text glow effect
   - `.text-balance` - Balanced text wrapping
   - Custom animations in globals.css

### Color Usage Patterns

```typescript
// Text colors
'text-gray-100' // Primary text
'text-gray-200' // Secondary headings
'text-gray-300' // Body text
'text-gray-400' // Muted descriptions
'text-blue-400' // Links

// Backgrounds
'bg-gray-900/50' // Semi-transparent cards
'bg-gray-800' // Solid surfaces
'bg-gray-700' // Hover states

// Borders
'border-gray-700' // Default borders
'border-gray-600' // Hover borders
```

## API & Data Fetching Patterns

### Server Components (Preferred)

```typescript
// In page.tsx files
async function Page() {
  const data = await Service.getData()  // Direct service calls
  return <Component data={data} />
}
```

### Real-time Updates (Socket.io)

```typescript
// Client-side WebSocket connections
import { io } from 'socket.io-client'

const socket = io()
socket.on('event', (data) => {
  // Handle real-time updates
})
```

## Environment Variables

```env
# Music Features (Required)
LASTFM_API_KEY=your_api_key

# Music Features (Optional)
LISTENBRAINZ_TOKEN=your_token
```

## Important Conventions

### 1. Import Aliases

- **ALWAYS** use `@/` for imports (configured in tsconfig.json)
- Example: `import { cn } from '@/lib/utils'`

### 2. File Naming

- Pages: `page.tsx`
- Layouts: `layout.tsx`
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `kebab-case.ts`

### 3. Component Patterns

```typescript
// Always define props interface
interface ComponentProps {
  prop1: string
  prop2?: number
  className?: string  // Allow style overrides
}

// Use function components with explicit types
export default function Component({ prop1, prop2, className }: ComponentProps) {
  return (
    <div className={cn('base-styles', className)}>
      {/* Content */}
    </div>
  )
}
```

### 4. Data Loading Patterns

```typescript
// Server Component (preferred for initial data)
async function Page() {
  const data = await fetchData()
  return <ClientComponent initialData={data} />
}

// Client Component (for interactivity)
'use client'
function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData)
  // Interactive logic
}
```

### 5. Error Handling

- Use try-catch in async functions
- Always have error handling built into the UI and console

### 6. Performance Optimizations

- Use dynamic imports for large components
- Implement proper loading states
- Utilize Next.js Image component for images
- Leverage ISR for static pages with periodic updates

## Common Patterns & Best Practices

### Dynamic Routes

```typescript
// app/[category]/[slug]/page.tsx
export async function generateStaticParams() {
  // Return array of params for static generation
}

export default async function Page({ params }: { params: { slug: string } }) {
  // Page implementation
}
```

### Metadata Generation

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: 'Page Title',
    description: 'Page description'
  }
}
```

### Client-Side Hooks

```typescript
'use client'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
```

## AI Usage Tracking with agent-exporter

### Overview

The application uses **agent-exporter** to track AI usage across multiple providers. The data is stored in `public/data/cc.json` and displayed on the `/ai/usage` page.

### Supported Providers

The application supports 5 AI providers through agent-exporter:

1. **Claude Code** (`claudeCode`) - Anthropic models via Claude Code
2. **Codex** (`codex`) - OpenAI models via Codex
3. **OpenCode** (`opencode`) - Open source AI coding assistant
4. **Qwen** (`qwen`) - Alibaba Qwen models
5. **Gemini** (`gemini`) - Google Gemini models

### Provider Configuration

Provider metadata is defined in `lib/config/ai-providers.ts`:

```typescript
import { PROVIDER_CONFIGS } from '@/lib/config/ai-providers'

// Get provider config
const config = PROVIDER_CONFIGS['claudeCode']
console.log(config.displayName) // 'Claude Code'
console.log(config.color) // '#D97757'

// Detect provider from model name
import { detectProvider } from '@/lib/config/ai-providers'
const provider = detectProvider('claude-sonnet-4-20250514') // 'claudeCode'
```

### Data Structure

The `public/data/cc.json` file follows the `ExtendedCCData` type:

```typescript
interface ExtendedCCData {
  totals?: Totals // Combined totals across all providers
  claudeCode?: ProviderData // Claude Code usage
  codex?: ProviderData // Codex usage
  opencode?: ProviderData // OpenCode usage
  qwen?: ProviderData // Qwen usage
  gemini?: ProviderData // Gemini usage
}
```

Each provider section contains:

- `daily`: Array of `DailyData` entries
- `totals`: Aggregated `Totals` for that provider

### Syncing Usage Data

The `tools/sync-usage.ts` tool syncs AI usage data from agent-exporter:

```bash
# Sync all data (recommended)
bun run sync:usage

# Preview changes without writing
bun run sync:usage --dry-run

# Skip syncing from providers (use cached data)
bun run sync:usage --no-sync

# Sync specific time period
bun run sync:usage --period monthly
bun run sync:usage --period yearly

# Sync specific date range
bun run sync:usage --start 2025-01-01 --end 2025-12-31

# Show help
bun run sync:usage --help
```

**Key Features**:

- Direct agent-exporter integration (no manual imports needed)
- Syncs all providers in one command
- Auto-computes grand totals across providers
- Provider name aliasing (e.g., `anthropic` → `claudeCode`)
- No data truncation - exports complete history
- Change detection - only writes if data changed

**Note**: The legacy `tools/ccombine.ts` is deprecated. Use `sync-usage.ts` instead.

### agent-exporter Commands

For advanced usage, you can use agent-exporter directly:

```bash
# Sync data from all providers
agent-exporter sync

# View today's usage
agent-exporter daily

# View monthly stats
agent-exporter monthly

# Export raw JSON
agent-exporter json --period yearly
```

### AIService Usage

The `AIService` provides analytics utilities:

```typescript
import { AIService } from '@/lib/services'

// Get model label (supports all providers)
const label = AIService.getModelLabel('claude-sonnet-4-5-20250929')
// Returns: 'Claude Sonnet 4.5'

// Compute activity streak
const streak = AIService.computeStreak(dailyData)

// Filter by time range
const last30Days = AIService.filterDailyByRange(dailyData, '1m')

// Build trend data with regression
const trendData = AIService.buildDailyTrendData(dailyData)

// Get comprehensive stats
const stats = AIService.getAIStats(ccData)
```

### Model Label Support

The AIService includes labels for models from all providers:

- **Claude**: Sonnet 4/4.5, Haiku 4.5, Opus 4.1, 3.5/3.7 Sonnet
- **OpenAI**: GPT-5, GPT-4o, o1/o3 variants
- **Gemini**: 2.0/2.5 Pro/Flash, Gemma 3
- **Qwen**: Qwen 3 variants, Turbo, Plus, Max
- **OpenCode**: Auto-detected from model patterns

Unknown models display their raw model ID.

### Provider Filtering in UI

Components can filter by provider using the `AIProvider` type:

```typescript
import type { AIProvider } from '@/lib/types'

function ProviderFilter() {
  const [provider, setProvider] = useState<AIProvider | 'all'>('all')

  // Load data based on selected provider
  const data = provider === 'all'
    ? ccData.totals
    : ccData[provider]?.totals

  return (
    // Provider filter UI
  )
}
```

### Migration Status

**✅ Completed:**

- Type system with 5 provider support
- Provider configuration and utilities
- AIService model labels
- Data structure updates

**⏳ In Progress:**

- ccombine tool agent-exporter integration
- UI component updates for new providers
- Provider-specific theming

See `AGENT-EXPORTER-MIGRATION.md` for detailed migration status and instructions.

## Security Notes

- Use environment variables for all secrets
- Validate and sanitize all user inputs
- Follow Next.js security best practices
