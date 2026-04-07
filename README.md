# markdown-reader

A terminal markdown reader built with [Ink](https://github.com/vadimdemedes/ink) and [marked](https://marked.js.org/). Renders markdown with syntax-highlighted code blocks, mouse and keyboard scrolling, and a pipe-friendly static mode.

## Features

- Headings colored by depth (cyan / green / yellow)
- Syntax-highlighted code blocks via [Shiki](https://shiki.style/) (Nord theme, 100+ languages)
- Tables with column alignment and automatic width clamping on narrow terminals
- Mouse wheel scrolling + vim-style keyboard navigation
- Status bar with filename and scroll percentage
- Non-TTY fallback — pipe or redirect output without errors

## Installation

### Global (recommended)

```bash
npm install -g .
mdread <file.md>
```

`npm install -g .` triggers the `prepare` script, which compiles `src/` → `dist/index.js` via esbuild automatically. No separate build step needed.

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

## Navigation

### Mouse

| Action | Effect |
|--------|--------|
| Scroll wheel up | 3 lines up |
| Scroll wheel down | 3 lines down |

### Keyboard

| Key | Action |
|-----|--------|
| `j` / `↓` | One line down |
| `k` / `↑` | One line up |
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
  hooks/
    useMouseScroll.ts        # SGR mouse wheel → scroll delta
  renderers/
    heading.tsx
    paragraph.tsx
    code.tsx
    list.tsx
    blockquote.tsx
    hr.tsx
    table.tsx                # Width-aware table with alignment + truncation
    __tests__/               # Vitest unit tests
  components/
    ScrollableApp.tsx        # TTY mode — keyboard + mouse scroll
    StaticApp.tsx            # Non-TTY mode — static dump
    StatusBar.tsx
```

## Stack

- [Ink](https://github.com/vadimdemedes/ink) — React for terminal UIs
- [marked](https://marked.js.org/) — Markdown lexer/parser
- [Shiki](https://shiki.style/) — Syntax highlighting
- [esbuild](https://esbuild.github.io/) — Zero-config TypeScript/TSX bundler
- [tsx](https://github.com/privatenumber/tsx) — No-build dev runner
- [Vitest](https://vitest.dev/) — Unit testing
- [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) — Linting
