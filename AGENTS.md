# AGENTS.md

## Project Overview

**aidanSO** (formerly aidxnCC) is a personal portfolio and services website built with Next.js 15, featuring real-time music tracking, domain management, device showcases, and AI usage analytics. The project is deployed at [aidan.so](https://aidan.so).

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

### Server & Build

```bash
# Development - runs custom Bun server with Socket.io on available port
bun run dev

# Production build (runs device data build + Next.js build)
bun run build

# Production build + start (requires pre-built application)
bun run start

# Pre-build device data (runs automatically during full build)
bun run build:devices
```

### Code Quality

```bash
# Type checking without emitting files
bun run typecheck

# Lint code with ESLint (flat config)
bun run lint

# Format code with Prettier
bun run format

# Check formatting without changes
bun run format:check
```

### Testing

```bash
# Run all tests (uses Bun test runner)
bun run test

# Run specific test file
bun test path/to/test.test.ts

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

### Analysis & Documentation

```bash
# Run best practices checks
bun run best-practices

# Run best practices (CI version, skips page-load-performance check)
bun run best-practices:ci

# List all available checks
bun run best-practices --list

# Run specific checks only
bun run best-practices --only=cc-model-labels,ai-config-validator

# Get JSON output from checks
bun run best-practices --json

# Show help for best-practices tool
bun run best-practices --help

# Run React Scan for performance analysis
bun run scan

# Generate TypeDoc documentation
bun run docs:generate

# Watch and regenerate documentation on file changes
bun run docs:watch
```

### AI Usage Data

```bash
# Sync AI usage data from agent-exporter
bun run sync:usage

# Preview changes without writing
bun run sync:usage --dry-run

# Sync specific time period
bun run sync:usage --period monthly

# Get help for sync tool
bun run sync:usage --help
```

**Important**: Do not run a development server unless specifically asked. Use better methods to check for issues:

- `bun run typecheck` - Check TypeScript types
- `bun run lint` - Check code quality
- `mcp__ide__getDiagnostics` - IDE diagnostics for syntax/type errors

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

#### 2. Formatting & Utility Functions (`lib/utils/`)

**Formatting Utilities** (`lib/utils/formatting.ts`)

```typescript
import { Formatter } from '@/lib/utils'

// Available formatters:
Formatter.currency(100, 2)          // '$100.00'
Formatter.tokens(1500000)           // '1.5M'
Formatter.percentage(85.5, 1)       // '85.5%'
Formatter.date(new Date())          // Uses 'short'|'long'|'iso' format
Formatter.duration(730)             // '2y' (days to years/months)
Formatter.fileSize(1572864)         // '1.5 MB'
Formatter.number(1234.56, 2)        // '1,234.56'
Formatter.capitalize('hello')       // 'Hello'
Formatter.truncate('long text', 5)  // 'lo...'
Formatter.slugify('Hello World')    // 'hello-world'
```

**Style Utilities** (`lib/utils/styles.ts`)
- Reusable style objects and constants

**Validation Utilities** (`lib/utils/validation.ts`)
- Input validation and sanitization helpers

**Device Text Utilities** (`lib/utils/device-text.ts`)
- Device-specific text formatting and display logic

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

**Navigation & Layout Components**

```typescript
import Link from '@/components/objects/Link'
import Button from '@/components/objects/Button'
import AnimatedTitle from '@/components/objects/AnimatedTitle'
import PageHeader from '@/components/objects/PageHeader'

// Link with variants
<Link
  href="/path"
  variant="default|nav|muted"
  external={true}  // Auto-adds target="_blank" and rel="noopener"
>

// Button with icon and variants
<Button
  href="/path"
  variant="primary|rounded"
  icon={<IconComponent />}
  target="_blank"  // Optional
>

// Animated page title
<AnimatedTitle text="Page Title" />

// Full-featured page header
<PageHeader title="Title" description="Optional description" />
```

**Utility & Display Components**

```typescript
import LoadingSpinner from '@/components/objects/LoadingSpinner'
import MusicText from '@/components/objects/MusicText'
import SeekBar from '@/components/objects/SeekBar'
import ProfilePicture from '@/components/objects/ProfilePicture'
import RandomFooterMsg from '@/components/objects/RandomFooterMsg'

// Loading states
<LoadingSpinner />

// Music-related displays
<MusicText />

// Audio seek bar
<SeekBar />

// Profile image with fallback
<ProfilePicture />

// Random footer message rotation
<RandomFooterMsg />
```

#### 5. Services Pattern (`lib/services/`)

Business logic is centralized in service modules:

```typescript
import {
  DomainService,
  DeviceService,
  ClientDeviceService,
  AIService,
  StatusService
} from '@/lib/services'

// Domain operations
const domains = DomainService.getAllDomainsEnriched()
const domain = DomainService.getDomainByName('example.com')
const filtered = DomainService.filterDomains({ status: 'active' })
const stats = DomainService.getDomainStats()

// Device operations (server-side)
const devices = DeviceService.getAllDevices()
const device = DeviceService.getDeviceBySlug('device-slug')

// Client device operations (browser-safe data)
const clientDevices = ClientDeviceService.getClientDevices()

// AI usage analytics
const label = AIService.getModelLabel('claude-sonnet-4-5-20250929')
const streak = AIService.computeStreak(dailyData)
const stats = AIService.getAIStats(ccData)

// Status/health checks
const status = StatusService.getStatus()
```

**Service Principles:**
- Services are stateless utility modules
- Use in server components for data fetching
- Export as named exports from `lib/services/index.ts`
- Implement consistent error handling and logging

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

## Testing Framework

The project uses **Bun's native test runner** (`bun:test`) for unit and integration tests.

### Test File Organization

- Test files use `.test.ts` or `.test.tsx` suffix
- Organized in `__tests__` directories alongside source code
- Test imports are configured to run with Bun's built-in test runner

### Writing Tests

```typescript
import { describe, expect, it, mock } from 'bun:test'

describe('MyFunction', () => {
  it('should do something', () => {
    const result = myFunction()
    expect(result).toBe(expectedValue)
  })

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

### Test Assertion Patterns

```typescript
// Common assertions
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTrue()
expect(value).toBeFalse()
expect(value).toHaveLength(n)
expect(fn).toThrow()
expect(Array.from(value)).toEqual([...])
```

### Available Test Commands

- `bun test` - Run all tests
- `bun test path/to/file.test.ts` - Run specific test
- `bun test --watch` - Watch mode
- `bun test --coverage` - Generate coverage report

**Reference**: Tests can be found in:
- `tools/__tests__/` - Tool validation tests
- `app/ai/usage/__tests__/` - Component schema tests
- `components/navigation/footer/__tests__/` - Component tests

## Code Formatting & Linting

### Prettier Configuration

The project uses Prettier with these settings (`.prettierrc`):
- **Print Width**: 80 characters
- **Tab Width**: 2 spaces
- **Quotes**: Single quotes (JSX: double quotes)
- **Semicolons**: Off
- **Trailing Commas**: None
- **Arrow Function Parens**: Always
- **Bracket Spacing**: Enabled
- **Plugins**: `prettier-plugin-tailwindcss` - Auto-sorts Tailwind classes

```bash
# Format files
bun run format

# Check formatting without changes
bun run format:check
```

### ESLint Configuration

The project uses ESLint 9 with flat config (`eslint.config.mjs`):
- **Extends**: Next.js core web vitals + TypeScript config
- **Plugins**: Prettier for formatting rules
- **Ignores**: `.next/`, `out/`, `build/`, `public/docs/`

```bash
# Lint all files
bun run lint

# Auto-fix linting issues (with Prettier integration)
bun run format
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

## Device Data Build Process

Device showcase data is pre-built at compile time using a custom build script (`tools/build-device-data.ts`).

### How It Works

1. **Source**: Device configurations are defined as TSX modules in `lib/config/devices/pages/`
   - `komodo.tsx`, `cheetah.tsx`, `bonito.tsx`, `jm21.tsx`
   - Each exports device metadata, components, and specs

2. **Transform**: The `transformDevicePage()` function converts TSX exports to plain JavaScript objects
   - Extracts component names for icons
   - Converts React components to serializable data
   - Generates client-safe data subset

3. **Output**: Produces two JSON artifacts
   - Full device data (used by server components)
   - Client device data (safe for browser exposure)

4. **Integration**: Automatically runs during `bun run build`
   - Executes before Next.js build
   - Generates data artifacts in `.next/` or build output

### Key Benefits

- Zero-runtime JSX parsing (components defined as TSX at build time)
- Type-safe device data through TypeScript
- SEO-friendly static pages
- Dynamic routing with pre-generated data

### When to Update

- Add new device pages → create new file in `lib/config/devices/pages/`
- Modify device metadata → edit corresponding device file
- Change icon mapping → update `lib/config/devices/icon-map.ts`
- Run `bun run build:devices` to regenerate (manual rebuild)

## Custom Server Architecture

The application uses a **custom Bun server** (`server.ts`) instead of the default Next.js server to enable Socket.io for real-time features.

### Key Features

1. **Automatic Port Resolution**: If port 3000 is in use, automatically tries 3001, 3002, etc. (up to 10 attempts)
2. **Socket.io Integration**: Real-time WebSocket communication for now-playing music updates
3. **Rate Limiting**: 10 requests per minute per socket to prevent abuse
4. **Auto-refresh**: Optional 30-second auto-refresh for now-playing data
5. **CORS Configuration**: Development-friendly CORS (localhost:3000, localhost:3001) with production override

### Server Lifecycle

```typescript
// server.ts handles:
1. Next.js app initialization
2. HTTP server creation
3. Socket.io setup with rate limiting
4. WebSocket upgrade handling (HMR in dev)
5. Port conflict resolution
```

### Socket.io Events

```typescript
// Client → Server
'requestNowPlaying' // Manually request now-playing data (rate-limited)
'startAutoRefresh' // Start 30s auto-refresh interval

// Server → Client
'nowPlaying' // Emit now-playing data or error
```

### NowPlayingService

Located at `lib/now-playing-server.ts`, handles:

- Last.fm API integration
- ListenBrainz fallback
- MusicBrainz cover art fetching
- Response caching and error handling

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

// Request now-playing data
socket.emit('requestNowPlaying')

// Start auto-refresh (30s intervals)
socket.emit('startAutoRefresh')

// Listen for updates
socket.on('nowPlaying', (data) => {
  if (data.status === 'success') {
    // Handle track data
  } else {
    // Handle error or rate limit
  }
})
```

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
PORT=3000                      # Server port (defaults to 3000, auto-increments if in use)
HOSTNAME=0.0.0.0              # Server hostname (defaults to localhost in dev, 0.0.0.0 in prod)
NODE_ENV=production           # Environment mode (automatically set by deployment platform)
CORS_ORIGIN=*                 # CORS origin for Socket.io (defaults to * in production)

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
   - Skipped in CI with `bun run best-practices:ci`

2. **cc-model-labels**: Validates that all AI models in `public/data/cc.json` have human-readable labels
   - Ensures provider compatibility and labeling consistency

3. **ai-config-validator**: Validates AI configuration data structure and integrity
   - Checks schema compliance and data validation

4. **device-icons**: Validates device icon mappings and references
   - Ensures all device icons are properly mapped and accessible

### Usage

```bash
# Run all checks
bun run best-practices

# List available checks
bun run best-practices --list

# Run specific checks only
bun run best-practices --only=cc-model-labels,ai-config-validator,page-load-performance,device-icons

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

## Bun Runtime Considerations

This project uses **Bun** instead of Node.js for all runtime operations.

### Key Differences from Node.js

- **Package Manager**: Bun replaces npm/yarn - `bunfig.toml` is the config file
- **Runtime**: Bun provides native TypeScript execution without transpilation
- **Test Runner**: Built-in `bun:test` replaces Jest or Mocha
- **Import Resolution**: Uses Bun's module resolution (generally faster and more compatible)

### Running Commands

All commands use `bun` prefix:
```bash
bun run <script>    # Run npm script
bun <file.ts>       # Execute TypeScript directly
bun test            # Run tests
bun add <package>   # Install package
```

### Bun-Specific Features Used

- **Native TypeScript execution** - No build step needed for `.ts` files
- **JSX support** - Transform JSX without compilation
- **ESM imports** - Full ES modules support
- **Built-in test framework** - `bun:test` with `describe`, `it`, `expect`
- **Node.js compatibility** - Runs most Node.js packages unchanged

### File: `bunfig.toml`

Minimal configuration - primarily used to configure the test runner root directory.

## Documentation Generation

TypeDoc documentation is automatically generated from JSDoc comments in the source code.

### Generating Docs

```bash
# Generate documentation
bun run docs:generate

# Watch mode - regenerate on file changes
bun run docs:watch
```

### Documentation Location

- **Output**: `public/docs/` (gitignored)
- **Configuration**: `tsconfig.json` (TypeDoc reads tsconfig)
- **DocGen Command**: Runs TypeDoc on the entire codebase

### JSDoc Standards

- Use JSDoc comments for public APIs
- Include `@module`, `@category`, and `@public` tags
- Example from `server.ts`:
  ```typescript
  /**
   * Custom server for Next.js with Socket.io for real-time features.
   * @remarks
   * Provides automatic port conflict resolution...
   * @module server
   * @category API
   * @public
   */
  ```

## Security Notes

- Use environment variables for all secrets
- Validate and sanitize all user inputs
- Follow Next.js security best practices
