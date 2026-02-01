# Similar Repos - AI Coding Assistant Guide

## Critical Constraints

- **NEVER** modify the AI provider SDK configurations directly in `src/utils/model..ts` without testing all supported providers
- **NEVER** change the Zod schema in `SimilarReposStreamService` without ensuring backward compatibility with existing AI responses
- **ALWAYS** use the `logger` utility instead of `console.log` for debugging
- **ALWAYS** wrap DOM manipulations in the content script with error boundaries - GitHub's DOM changes frequently
- **NEVER** store sensitive data (API keys) in plain text - use the storage utility which encrypts at rest

## Tech Stack & Conventions

### Core Technologies

- **Framework**: WXT (browser extension framework) + React 19
- **Language**: TypeScript 5.9 (strict mode enabled)
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **State**: Jotai for atomic state management
- **AI SDK**: Vercel AI SDK for streaming responses
- **UI Components**: Radix UI primitives with custom styling (shadcn/ui pattern)

### Code Style Rules

- Use functional components with hooks only - no class components
- Prefer `const` functions over `function` declarations for component definitions
- Use absolute imports with `@/` prefix for all project files
- Type all function return values explicitly
- Use `type` over `interface` for object definitions (project convention)

### File Naming Conventions

- Components: PascalCase (e.g., `SimilarRepos.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useSimilarRepos.ts`)
- Utilities: camelCase (e.g., `github.ts`)
- Services: PascalCase with `Service` suffix (e.g., `SimilarReposStreamService.ts`)

## Common Commands

```bash
# Development
pnpm dev              # Chrome (default)
pnpm dev:firefox      # Firefox
pnpm dev:edge         # Edge

# Build
pnpm build            # Production build for Chrome
pnpm build:firefox    # Production build for Firefox
pnpm build:edge       # Production build for Edge

# Package for distribution
pnpm zip              # Creates .zip for Chrome Web Store
pnpm zip:firefox      # Creates .zip for Firefox Add-ons

# Quality checks
pnpm lint             # ESLint check
pnpm type-check       # TypeScript compilation check
pnpm test             # Run Vitest tests
```

## Project Structure Patterns

### Entry Points (WXT Convention)

All extension entry points live in `src/entrypoints/`:

- `background/` - Service worker for cross-tab messaging and API proxying
- `host.content/` - Content script injected into GitHub pages
- `options/` - Extension settings page (full-page)
- `popup/` - Toolbar popup (minimal UI)

### Component Organization

```
src/components/
├── ui/           # Base shadcn/ui components (Button, Input, Dialog, etc.)
├── common/       # Shared across features (ModelSelector, ShadowPortal)
└── features/     # Feature-specific components
    ├── host/     # Content script UI (SimilarRepos sidebar)
    └── options/  # Settings page sections
```

### Services Pattern

Business logic is encapsulated in service classes:

- `SimilarReposStreamService` - Handles AI streaming for recommendations
- `GithubStatsService` - Fetches real-time GitHub API data
- `TestModelService` - Validates AI provider connections

Services should be stateless where possible; use React hooks for stateful logic.

## Key Patterns & Examples

### Adding a New AI Provider

1. Add provider config to `src/types/provider-config.ts`:

```typescript
newprovider: {
  id: 'newprovider',
  name: 'New Provider',
  description: 'Description',
  icon: newproviderIcon,
  defaultBaseUrl: 'https://api.newprovider.com/v1',
  requiresBaseUrl: false,
  models: [{ id: 'model-1', name: 'Model 1' }],
}
```

2. Add model client creation in `src/utils/model..ts`:

```typescript
case 'newprovider':
  return [createProvider('newprovider', apiKey, baseUrl), options]
```

3. Install the corresponding AI SDK package: `pnpm add @ai-sdk/newprovider`

### Content Script DOM Injection

Always use Shadow DOM to isolate styles:

```typescript
const ui = await createShadowRootUi(ctx, {
  name: 'similar-repos-host',
  position: 'overlay',
  anchor: 'body',
  onMount: (container, shadow) => {
    addStyleToShadow(shadow)
    const root = ReactDOM.createRoot(container)
    root.render(<App />)
    return root
  },
})
```

### State Management with Jotai

Define atoms in feature-specific atom files:

```typescript
// src/entrypoints/host.content/atoms.ts
import { atom } from 'jotai'

export const allRecommendedReposAtom = atom<string[]>([])
export const currentRepoAtom = atom<GitHubRepoInfo | null>(null)
```

Use in components:

```typescript
const [repos, setRepos] = useAtom(allRecommendedReposAtom)
```

### Streaming AI Responses

Use the established pattern in `SimilarReposStreamService`:

```typescript
const { partialOutputStream } = await streamText({
  model,
  output: Output.array({ element: z.object({...}) }),
  messages,
  providerOptions,
})

for await (const partialOutput of partialOutputStream) {
  yield partialOutput
}
```

## Testing Guidelines

- Use Vitest for unit tests
- Mock browser APIs using `vitest-browser-context`
- Test service logic in isolation; mock AI SDK responses
- For content script tests, mock DOM structures matching GitHub's HTML

## Environment Variables

Create `.env.local` for local development:

```
# Optional: Analytics API key
WXT_ANALYTICS_API_KEY=your_key
```

**Note**: User API keys for AI providers are NOT stored in env vars - they are stored via the extension's storage API.

## Common Gotchas

1. **GitHub DOM Changes**: GitHub updates their HTML structure frequently. The `extractRepoInfoFromDOM()` function in `src/utils/github.ts` is the most fragile part of the codebase. When GitHub updates, this is likely to break.

2. **Shadow DOM Styling**: Tailwind classes in content scripts require special handling. The `addStyleToShadow()` utility injects compiled CSS into the shadow root.

3. **Port Communication**: Background script communication uses browser runtime ports. Always handle `onDisconnect` to clean up listeners and prevent memory leaks.

4. **Streaming Timeouts**: AI providers have varying response times. The UI handles partial responses gracefully - don't assume all data arrives at once.

5. **CORS Restrictions**: Content scripts cannot directly call AI APIs due to CSP. All AI calls go through the background script.

## Debugging Tips

- Enable verbose logging: Set `DEBUG=true` in storage to see all `logger` output
- Background script logs: Go to `chrome://extensions` → Service Worker → Inspect
- Content script logs: Visible in the main page DevTools console
- Use the Options page "Test Connection" button to verify AI provider setup
