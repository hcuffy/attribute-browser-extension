# Code Review Guidelines

Review guidelines for the **Attribute Scanner** Chrome extension.

## Code Style

- Type annotations: NO space after colon (`name:string` not `name: string`)
- Use lodash for utilities (`forEach`, `map`, `includes`, etc.)
- Prefer named function expressions over arrows in React hooks
- 4-space indentation, single quotes, semicolons required

## Architecture

### Content Script (`content.ts`)
- Use `WeakMap` for storing original styles before modification
- All DOM changes must be revertible via `clearHighlights()`
- Filter non-visible elements in "missing" mode
- Handle invalid CSS selectors with try/catch

### Popup (`popup/`)
- Functional React components with hooks
- Handle `chrome://` URLs gracefully (cannot be scanned)
- Clear user feedback with emoji status indicators

### Helpers (`helpers.ts`)
- Pure functions only
- `isInteractive()` determines which elements to highlight in "missing" mode

### Background (`background.ts`)
- Keep minimal - logging and lifecycle events only

### Testing (`*.test.ts`, `*.test.tsx`)
- Jest with React Testing Library
- Test files co-located with source files
- Chrome API mocked in `jest.setup.ts`
- Pure functions should have comprehensive unit tests
- Use descriptive `describe`/`it` blocks
- `helpers.test.ts` - Tests for `isInteractive()` utility
- `content.test.ts` - Tests for `scanElements()`, `clearHighlights()`, attribute scanning

## Review Checklist

- [ ] Type annotations follow no-space convention
- [ ] DOM modifications store original state in WeakMap
- [ ] Error states handled with user-friendly messages
- [ ] No unnecessary permissions in manifest.json
- [ ] Interactive element detection logic is correct
- [ ] New utility functions have corresponding unit tests
- [ ] Tests follow existing patterns in `helpers.test.ts` and `content.test.ts`
- [ ] Attribute scanning changes have tests covering WITH and MISSING modes
