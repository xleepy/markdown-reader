#!/usr/bin/env tsx
import { render } from 'ink';
import { marked } from 'marked';
import type { Tokens } from 'marked';
import { readFileSync } from 'fs';
import React from 'react';
import { buildHighlights } from './highlight.js';
import { ScrollableApp } from './components/ScrollableApp.js';
import { StaticApp } from './components/StaticApp.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npm start -- <file.md>');
  process.exit(1);
}

const raw = readFileSync(filePath, 'utf8');
const tokens = marked.lexer(raw);
const isTTY = Boolean(process.stdin.isTTY);

async function init() {
  const codTokens = tokens.filter((t): t is Tokens.Code => t.type === 'code');
  const codeHighlights = await buildHighlights(codTokens);

  render(
    isTTY ? (
      <ScrollableApp tokens={tokens} codeHighlights={codeHighlights} filePath={filePath!} />
    ) : (
      <StaticApp tokens={tokens} codeHighlights={codeHighlights} />
    )
  );
}

init();
