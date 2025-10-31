# Tools Directory

This directory contains utility scripts for managing the aidxnCC project.

## AI Usage Data Sync

### sync-usage.ts

**Replaces**: `ccombine.ts` (deprecated)

Syncs AI usage data from [agent-exporter](https://github.com/aidanaden/agent-exporter) to `public/data/cc.json`. This tool provides a direct integration with agent-exporter, eliminating the need for the legacy ccombine tool.

#### Usage

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

# Custom output path
bun run sync:usage --output data/usage.json

# Show help
bun run sync:usage --help
```

#### Features

- **Direct agent-exporter integration**: Uses `agent-exporter json` command
- **Multi-provider support**: Syncs data from all configured AI providers
  - Claude Code (claudeCode)
  - Codex (codex)
  - OpenCode (opencode)
  - Qwen (qwen)
  - Gemini (gemini)
- **Provider aliasing**: Automatically maps provider names (e.g., `anthropic` → `claudeCode`)
- **Grand totals**: Automatically computes combined totals across all providers
- **No data truncation**: Exports complete usage history
- **Change detection**: Only writes file if data has changed
- **Dry run mode**: Preview changes before applying
- **Input validation**: Validates date formats (YYYY-MM-DD), date ranges, and period values

#### Testing

Comprehensive tests are available in `tools/__tests__/sync-usage.test.ts`:

```bash
# Run tests
bun test tools/__tests__/sync-usage.test.ts
```

#### Data Structure

The tool exports data in the `ExtendedCCData` format:

```json
{
  "totals": {
    "inputTokens": 708941,
    "outputTokens": 505338,
    "totalCost": 282.49
  },
  "claudeCode": {
    "daily": [...],
    "totals": {...}
  },
  "codex": {
    "daily": [...],
    "totals": {...}
  }
}
```

#### Migration from ccombine

The `ccombine.ts` tool is now deprecated. Use `sync-usage.ts` instead:

| ccombine                                      | sync-usage                                   |
| --------------------------------------------- | -------------------------------------------- |
| `bun tools/ccombine.ts auto`                  | `bun run sync:usage`                         |
| `bun tools/ccombine.ts sync file.json claude` | `bun run sync:usage` (direct agent-exporter) |
| `bun tools/ccombine.ts --dry`                 | `bun run sync:usage --dry-run`               |
| `bun tools/ccombine.ts init`                  | Not needed (auto-initializes)                |

**Benefits over ccombine**:

- No manual file imports needed
- Direct agent-exporter integration
- Supports all providers in one command
- Simpler command-line interface
- No data loss or truncation

## Best Practices Checker

### best-practices.ts

Analyzes the codebase for adherence to project conventions and best practices.

```bash
bun run check:best
```

See [best-practices/README.md](./best-practices/README.md) for details.
