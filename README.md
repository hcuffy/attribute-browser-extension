# Attribute Scanner - Chrome Extension

A Chrome browser extension for scanning and highlighting elements by custom attributes. Perfect for QA testing with frameworks like Cypress that use `data-*` attributes for element selection.

## Features

- **Scan for elements WITH attribute**: Highlights elements that have a specified attribute (e.g., `data-cy`) with a green outline
- **Scan for elements MISSING attribute**: Highlights interactive elements that are missing the attribute with a soft red outline  
- **Customizable attribute name**: Scan for any attribute like `data-cy`, `data-testid`, `data-qa`, etc.
- **Clear highlights**: Easily remove all highlights with one click

## Quick Start

### 1. Install Dependencies

Make sure you have Node.js (v18+) and pnpm installed.

```bash
pnpm install
```

### 2. Build the Extension

```bash
pnpm build
```

This creates a `dist/` folder with all compiled files:
- `manifest.json` - Extension manifest (auto-copied)
- `popup/popup.html` - Popup UI
- `popup/popup.js` - React popup bundle
- `popup/popup.css` - Styles
- `content.js` - Content script
- `background.js` - Service worker
- `icons/` - SVG icons (auto-generated)

### 3. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist/` folder from this project
5. The extension icon (blue "AS") should appear in your toolbar

## Usage

1. **Click the extension icon** in your browser toolbar to open the popup
2. **Enter an attribute name** (default is `data-cy`)
3. **Choose the scan mode**:
   - **Unchecked**: Find elements WITH the attribute (green highlight)
   - **Checked**: Find elements MISSING the attribute (soft red highlight)
4. **Click "Scan Page"** to highlight matching elements
5. **Click "Clear Highlights"** to remove all highlights

### Scan Modes

| Mode | Selector Used | Highlight Style |
|------|---------------|-----------------|
| WITH attribute | `[data-cy]` | `2px solid limegreen` |
| MISSING attribute | `*:not([data-cy])` (interactive elements only) | `3px solid rgba(255,0,0,0.3)` |

## Development

### Project Structure

```
├── manifest.json          # Chrome extension manifest (V3)
├── src/
│   ├── popup/
│   │   ├── popup.html     # Popup HTML entry point
│   │   ├── popup.tsx      # React popup component
│   │   └── popup.css      # Popup styles
│   ├── content.ts         # Content script (runs on web pages)
│   └── background.ts      # Service worker (minimal)
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── package.json           # Dependencies and scripts
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build the extension for production |
| `pnpm dev` | Build with watch mode for development |
| `pnpm typecheck` | Run TypeScript type checking only |
| `pnpm test` | Run unit tests with Jest |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |

### How It Works

1. **Popup UI** (`popup.tsx`): React component that provides the user interface
2. **Message Passing**: Popup sends messages via `chrome.tabs.sendMessage()` to the content script
3. **Content Script** (`content.ts`): Receives messages and performs DOM queries to find/highlight elements
4. **Highlighting**: Uses CSS `outline` property to highlight elements without affecting layout

### Message Flow

```
Popup (popup.tsx)
    │
    │ chrome.tabs.sendMessage({action: 'scan', attribute: 'data-cy', mode: 'with'})
    ▼
Content Script (content.ts)
    │
    │ document.querySelectorAll('[data-cy]')
    │ element.style.outline = '2px solid limegreen'
    ▼
Response {success: true, count: 42}
```

### Testing

The project uses **Jest** with **React Testing Library** for unit testing.

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode for TDD
pnpm test:coverage     # Generate coverage report
```

Test files are placed alongside source files with `.test.ts` or `.test.tsx` extension:

```
src/
├── helpers.ts
├── helpers.test.ts    # Tests for isInteractive utility
├── content.ts
├── content.test.ts    # Tests for data-cy attribute scanning
└── popup/
    ├── popup.tsx
    └── popup.test.tsx # Tests for popup component (future)
```

**Current test coverage:**
- `helpers.test.ts` - 15 tests for interactive element detection
- `content.test.ts` - 21 tests for attribute scanning (`data-cy`, `data-testid`, etc.)

Chrome API is mocked in `jest.setup.ts` for extension-specific testing.

### Development Workflow

1. Run `pnpm dev` to start watch mode
2. Make changes to source files
3. Run `pnpm test` to ensure tests pass
4. Go to `chrome://extensions/` and click the refresh icon on the extension
5. Test your changes manually

## Troubleshooting

### Extension not working?

1. **Refresh the page** after loading/updating the extension
2. **Check the console** (F12) for error messages prefixed with `[Attribute Scanner]`
3. **Ensure the page is not a Chrome internal page** (`chrome://` URLs are restricted)
4. **Try reloading the extension** - click the refresh icon in `chrome://extensions/`

### "Could not establish connection" error?

This happens when the content script hasn't loaded yet. Refresh the target page.

### Build errors?

1. Make sure all dependencies are installed: `pnpm install`
2. Check Node.js version (v18+ recommended)
3. Run `pnpm typecheck` to see TypeScript errors

## Technical Details

- **Manifest Version**: V3 (latest Chrome extension standard)
- **Build Tool**: Vite 5 with React plugin
- **TypeScript**: Strict mode enabled
- **React**: 18.x for popup UI
- **Permissions**: `activeTab`, `scripting` (minimal required permissions)

## License

MIT





