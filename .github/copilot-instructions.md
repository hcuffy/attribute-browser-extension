# Development Guidelines

Guidelines for the **Attribute Scanner** Chrome extension - a tool for scanning and highlighting DOM elements by custom attributes (e.g., `data-cy`).

## Quick Start

```bash
pnpm install        
pnpm dev            
pnpm build         
pnpm lint          
pnpm typecheck     
pnpm test           
pnpm test:watch    
pnpm test:coverage 
```

### Loading in Chrome

1. Run `pnpm build`
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** → select `dist/`

## Project Structure

```
├── manifest.json          # Chrome Extension Manifest V3
├── src/
│   ├── popup/
│   │   ├── popup.html     # Entry point
│   │   ├── popup.tsx      # React UI
│   │   └── popup.css      # Styles
│   ├── content.ts         # Runs on web pages (attribute scanning)
│   ├── content.test.ts    # Tests for attribute scanning
│   ├── background.ts      # Service worker
│   ├── helpers.ts         # Utilities (isInteractive)
│   └── helpers.test.ts    # Tests for helpers
├── types/
│   └── index..d.ts        # Type definitions
├── jest.config.ts         # Jest configuration
├── jest.setup.ts          # Test setup with Chrome API mocks
├── vite.config.ts         # Build config
└── eslint.config.js       # Linting rules
```

## Code Style

### Naming
- camelCase for variables/functions
- PascalCase for types/interfaces/components
- kebab-case for files

### TypeScript
- NO space after colon in type annotations: `name:string`
- Define interfaces in `types/index..d.ts`

```typescript

function scan(attr:string, mode:'with' | 'missing'):number { }

// Incorrect  
function scan(attr: string, mode: 'with' | 'missing'): number { }
```

### Imports
- Exact lodash imports: `import { forEach, map } from 'lodash'`
- Prefer named exports

### Functions
- Prefer named function expressions in hooks:

```typescript
const handleScan = useCallback(async function() {
    // ...
}, [deps]);
```

## Message Types

```typescript
interface Message {
    action:'scan' | 'clear';
    attribute?:string;
    mode?:'with' | 'missing';
}

interface ScanResponse {
    success:boolean;
    count?:number;
    error?:string;
}
```

## Key Patterns

### DOM Highlighting
- Store original styles in `WeakMap` before modifying
- Use `outline` property (doesn't affect layout)
- Always support clean revert via `clearHighlights()`

### Interactive Elements (missing mode)
Only highlight: `button`, `a`, `input`, `select`, `textarea`, `form`, elements with `role="button"`, `role="link"`, `onclick`, or `tabindex`.

### Highlight Styles
| Mode | Style |
|------|-------|
| WITH | `2px solid limegreen` |
| MISSING | `3px solid rgba(255,0,0,0.3)` |

## Testing

- **Framework**: Jest with React Testing Library
- **Test files**: Co-locate with source as `*.test.ts` or `*.test.tsx`
- **Chrome API**: Mocked in `jest.setup.ts`
- **Run tests**: `pnpm test` before committing

**Existing test files:**
- `helpers.test.ts` - 15 tests for `isInteractive()` utility
- `content.test.ts` - 21 tests for `scanElements()`, `clearHighlights()`, attribute scanning

```typescript
// Example test structure
describe('scanElements', () => {
    it('should find elements with data-cy attribute', () => {
        document.body.innerHTML = '<button data-cy="test">Click</button>';

        const count = scanElements('data-cy', 'with');

        expect(count).toBe(1);
    });
});
```

## Troubleshooting

**"Could not establish connection"** - Refresh the target page

**Extension not working** - Refresh page after extension update, check console for `[Attribute Scanner]` logs

**Build errors** - Run `pnpm install`, verify Node.js >= 18

**Test errors** - Ensure `pnpm install` was run, check `jest.setup.ts` for missing mocks
