# markdown-reader

A terminal markdown reader built with [Ink](https://github.com/vadimdemedes/ink) and [marked](https://marked.js.org/). Renders markdown with syntax-highlighted code blocks and a scrollable viewport.

## Features

- Headings colored by depth (cyan / green / yellow)
- Syntax-highlighted code blocks via [Shiki](https://shiki.style/) (Nord theme)
- Scrollable viewport with vim-style keybindings
- Non-TTY fallback — pipe-friendly static output

## Installation

### Global (recommended)

```bash
npm install -g .
mdread <file.md>
```

`npm install -g .` runs the `prepare` script automatically, which compiles `src/` → `dist/index.js` via esbuild before linking. No separate build step needed.

### Development (symlinked)

```bash
npm link
mdread <file.md>

# To unlink later
npm unlink -g markdown-reader
```

### Without installing

```bash
npm start -- <file.md>
```

### Keybindings

| Key | Action |
|-----|--------|
| `j` / `↓` | Scroll down one line |
| `k` / `↑` | Scroll up one line |
| `d` / `u` | Half-page down / up |
| `PgDn` / `PgUp` | Full page down / up |
| `g` | Jump to top |
| `G` | Jump to bottom |
| `q` | Quit |

## Development

```bash
npm run build       # Compile src/ → dist/ via esbuild
npm run typecheck   # TypeScript type check
npm run lint        # ESLint
npm test            # Run tests (vitest)
npm run test:watch  # Watch mode
```

## Project Structure

```
src/
  index.tsx                  # Entry point — parse args, init highlighter, render
  highlight.ts               # Async shiki syntax highlighting
  tokenToLines.tsx           # Token dispatcher + useAllLines hook
  renderers/
    heading.tsx
    paragraph.tsx
    code.tsx
    list.tsx
    blockquote.tsx
    hr.tsx
    __tests__/               # Vitest unit tests
  components/
    ScrollableApp.tsx        # TTY mode — keyboard scroll
    StaticApp.tsx            # Non-TTY mode — static dump
    StatusBar.tsx
```

## Stack

- [Ink](https://github.com/vadimdemedes/ink) — React for terminal UIs
- [marked](https://marked.js.org/) — Markdown lexer/parser
- [Shiki](https://shiki.style/) — Syntax highlighting
- [TypeScript](https://www.typescriptlang.org/) + [tsx](https://github.com/privatenumber/tsx) — No build step required
- [Vitest](https://vitest.dev/) — Unit testing
- [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) — Linting
