# markdown-reader

A terminal markdown reader built with [Ink](https://github.com/vadimdemedes/ink) and [marked](https://marked.js.org/). Renders markdown with syntax-highlighted code blocks, mouse and keyboard scrolling, and a pipe-friendly static mode.

## Features

- **File explorer** — pass a directory to browse and open markdown files interactively
- Headings colored by depth (cyan / green / yellow)
- Syntax-highlighted code blocks via [Shiki](https://shiki.style/) (Nord theme, 100+ languages)
- Tables with column alignment and automatic width clamping on narrow terminals
- Inertial mouse wheel scrolling + vim-style keyboard navigation
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
npm start -- <directory>   # opens file explorer
```

## Navigation

### File explorer

| Key | Action |
|-----|--------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `Enter` | Open file / enter directory |
| `-` | Go up to parent directory |
| `q` | Quit |

### Viewer

#### Mouse

| Action | Effect |
|--------|--------|
| Scroll wheel up | 3 lines up |
| Scroll wheel down | 3 lines down |

#### Keyboard

| Key | Action |
|-----|--------|
| `j` / `↓` | One line down |
| `k` / `↑` | One line up |
| `d` / `u` | Half-page down / up |
| `PgDn` / `PgUp` | Full page down / up |
| `g` | Jump to top |
| `G` | Jump to bottom |
| `q` / `Esc` | Back to explorer / quit |

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
  index.tsx          # Entry point
  highlight.ts       # Shiki syntax highlighting
  tokenToLines.tsx   # Markdown token → renderable lines
  hooks/             # Custom React hooks (scroll, mouse)
  renderers/         # Per-token-type render components + tests
  components/        # App-level components (explorer, viewer, status bar)
```

## Stack

- [Ink](https://github.com/vadimdemedes/ink) — React for terminal UIs
- [marked](https://marked.js.org/) — Markdown lexer/parser
- [Shiki](https://shiki.style/) — Syntax highlighting
- [esbuild](https://esbuild.github.io/) — Zero-config TypeScript/TSX bundler
- [tsx](https://github.com/privatenumber/tsx) — No-build dev runner
- [Vitest](https://vitest.dev/) — Unit testing
- [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) — Linting
