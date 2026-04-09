import { render } from 'ink';
import { marked } from 'marked';
import type { Tokens } from 'marked';
import { readFileSync, statSync } from 'fs';
import React from 'react';
import { buildHighlights } from './highlight.js';
import { ScrollableApp } from './components/ScrollableApp.js';
import { StaticApp } from './components/StaticApp.js';
import { App } from './components/App.js';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: mdread <file.md | directory>');
  process.exit(1);
}

const isTTY = Boolean(process.stdin.isTTY);

async function init() {
  const stat = statSync(inputPath);

  if (stat.isDirectory()) {
    if (!isTTY) {
      console.error('Directory browsing requires an interactive terminal.');
      process.exit(1);
    }
    render(<App dirPath={inputPath} />);
    return;
  }

  const raw = readFileSync(inputPath, 'utf8');
  const tokens = marked.lexer(raw);
  const codeTokens = tokens.filter((t): t is Tokens.Code => t.type === 'code');
  const codeHighlights = await buildHighlights(codeTokens);

  render(
    isTTY ? (
      <ScrollableApp tokens={tokens} codeHighlights={codeHighlights} filePath={inputPath} />
    ) : (
      <StaticApp tokens={tokens} codeHighlights={codeHighlights} />
    )
  );
}

init();
