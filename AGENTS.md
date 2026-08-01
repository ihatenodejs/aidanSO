**aidanSO** is a personal portfolio and services website built with Next.js 16, featuring polling-based music tracking, domain management, device showcases, and AI usage analytics. The project is deployed at [aidan.so](https://aidan.so).

### Tech Stack

- **Package manager and script runner**: Bun — run project scripts with `bun run`
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom theme system
- **Production output**: Next.js standalone output (`.next/standalone/server.js`)
- **UI Libraries**: Internal UI primitives, LobeHub, Lucide, and React Icons
- **Data Visualization**: Recharts

## Development Commands

```bash
# Development
bun run dev

# Production build and start
bun run build
bun run start

# Code Quality
bun run lint              # Run ESLint
bun run typecheck         # Type checking without emitting files
bun run format            # Format code with Prettier
bun run format:check      # Check formatting without changes
bun run test              # Run tests
bun run best-practices    # Run best practices checks
bun run best-practices:ci # Run best practices (skips page-load-performance)

# Analysis & Monitoring
bun run scan              # Run React Scan for performance analysis

# AI Usage Data
bun run sync:usage        # Sync AI usage data from agent-exporter
```

**Important**: Do not run a development server unless specifically asked. Use targeted checks instead:

- `bun run typecheck` — Check TypeScript types
- `bun run lint` — Check code quality
- `bun run test` — Run the Bun test suite

## Project Architecture

### Directory Structure

```
/app                  # Next.js App Router pages
  /about              # About page
  /ai                 # AI tools and usage analytics
    /usage            # AI usage tracking page and components
  /contact            # Contact page
  /device             # Individual device showcase pages
  /devices            # Device overview
  /domains            # Domain portfolio management
  /manifesto          # Personal manifesto page
  /status             # Service status page
  /api                # API routes
    /now-playing      # Music tracking endpoint
    /status           # Service status endpoint

/components           # Reusable React components
  /device             # Device-specific components
  /domains            # Domain management components
  /icons              # Custom icon components
  /layout             # Shared layout components
  /navigation         # Header and footer navigation
  /objects            # Common UI elements (IMPORTANT - reuse these!)
  /ui                 # Base UI components
  /widgets            # Feature-specific widgets

/lib                  # Core application logic (IMPORTANT - always use these utilities!)
  /config             # Application configuration
  /devices            # Device data and configuration
  /domains            # Domain data and utilities
  /services           # Business logic services
  /theme              # Theme system and design tokens
  /types              # TypeScript type definitions
  /utils              # Utility functions
  /validation         # Shared validation helpers

/public               # Static assets
  /data               # JSON data files
  /img                # Images
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

## Now-Playing Architecture

`lib/services/now-playing.service.ts` fetches ListenBrainz playback data, enriches it with Last.fm and MusicBrainz/Cover Art Archive data, and maintains a per-process 20-second result cache with in-flight request de-duplication.

`GET /api/now-playing` runs on the Node.js runtime, instantiates this service once per process, and returns the full `NowPlayingData` payload. Recoverable upstream errors remain HTTP 200 responses with `status: 'error'`.

`components/widgets/NowPlaying.tsx` fetches the endpoint immediately and every 30 seconds. Its `onLiveChange` callback drives the `LiveIndicator` based on the latest API result.

The standalone output uses Next's generated `server.js`; no custom server or Socket.IO transport is used.

## API & Data Fetching Patterns

### Server Components (Preferred)

```typescript
// In page.tsx files
async function Page() {
  const data = await Service.getData()  // Direct service calls
  return <Component data={data} />
}
```

### Polling Updates

```typescript
const response = await fetch('/api/now-playing')
const nowPlaying = await response.json()
```

The now-playing widget starts this request immediately, repeats it every 30 seconds, and aborts outstanding work when unmounted.

## Environment Variables

### Required Variables

```env
# Music Features (Required)
LASTFM_API_KEY=your_api_key    # Get from Last.fm API account
```

### Optional Variables

```env
# Music Features
LISTENBRAINZ_TOKEN=your_token  # Get from ListenBrainz user settings

# GitHub Integration (for footer projects list)
GITHUB_PROJECTS_USER=username  # GitHub username to display projects (defaults to 'ihatenodejs')
GITHUB_USERNAME=username       # Fallback if GITHUB_PROJECTS_USER not set
GITHUB_PROJECTS_PAT=token      # Personal access token for higher API limits
GITHUB_PAT=token               # Fallback if GITHUB_PROJECTS_PAT not set

# Server Configuration
PORT=3000                      # Server port
HOSTNAME=0.0.0.0               # Server hostname
NODE_ENV=production            # Environment mode (automatically set by deployment platform)

# Application Defaults
NEXT_PUBLIC_DEFAULT_TIME_RANGE=3m  # Default time range for AI usage page (3m = 3 months)
```

### Docker Deployment

Use the `docker-compose.yml.example` file as a template. Create a `.env` file with required variables and run:

```bash
docker compose up -d --build
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

## Best Practices Tool

The project includes a custom best-practices validation tool (`tools/best-practices.ts`) that runs automated checks for code quality and standards.

### Available Checks

1. **page-load-performance**: Measures page load times to ensure performance goals are met
2. **cc-model-labels**: Validates that all AI models in `public/data/cc.json` have human-readable labels
3. **ai-config-validator**: Validates AI configuration data structure and integrity

### Usage

```bash
# Run all checks
bun run best-practices

# List available checks
bun run best-practices --list

# Run specific checks only
bun run best-practices --only=cc-model-labels,ai-config-validator

# Skip specific checks (useful in CI)
bun run best-practices --skip=page-load-performance
bun run best-practices:ci  # Shorthand for skipping page-load-performance

# Get machine-readable JSON output
bun run best-practices --json

# Show help
bun run best-practices --help
```

### Creating Custom Checks

To add new checks, create a module in `tools/best-practices/modules/` that exports a `CheckDefinition`:

```typescript
import type { CheckDefinition } from '../types'

export default {
  id: 'my-check',
  name: 'My Custom Check',
  description: 'Description of what this check validates',
  async run(context): Promise<CheckResult> {
    // Implement check logic
    return { pass: true }
  }
} satisfies CheckDefinition
```

The tool automatically discovers and loads all checks from the modules directory.

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

The agent-exporter migration is complete:

- The type system, provider configuration, model labels, and data structure support all five providers.
- `tools/sync-usage.ts` is the supported integration and synchronizes provider data into `public/data/cc.json`.
- The `/ai/usage` UI provides provider filtering and provider-specific themes for all supported providers.
- `tools/ccombine.ts` remains a legacy manual CLI; use `sync:usage` for routine synchronization.

## Security Notes

- Use environment variables for all secrets
- Validate and sanitize all user inputs
- Follow Next.js security best practices
