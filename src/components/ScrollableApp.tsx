import { Box, useInput, useStdout } from 'ink';
import type { Token } from 'marked';
import { useState } from 'react';
import React from 'react';
import type { CodeHighlights } from '../highlight.js';
import { useMouseScroll } from '../hooks/useMouseScroll.js';
import { useAllLines } from '../tokenToLines.js';
import { StatusBar } from './StatusBar.js';

interface ScrollableAppProps {
  tokens: Token[];
  codeHighlights: CodeHighlights;
  filePath: string;
}

export function ScrollableApp({ tokens, codeHighlights, filePath }: ScrollableAppProps) {
  const { stdout } = useStdout();
  const width = stdout.columns || 80;
  const height = stdout.rows || 24;
  const viewHeight = height - 1;

  const [scrollY, setScrollY] = useState(0);
  const allLines = useAllLines(tokens, width, codeHighlights);
  const maxScroll = Math.max(0, allLines.length - viewHeight);

  const clamp = (s: number, delta: number) => Math.max(0, Math.min(maxScroll, s + delta));

  useMouseScroll((delta) => setScrollY((s) => clamp(s, delta)));

  useInput((input, key) => {
    if (key.downArrow || input === 'j') setScrollY((s) => Math.min(maxScroll, s + 1));
    if (key.upArrow || input === 'k') setScrollY((s) => Math.max(0, s - 1));
    if (input === 'd') setScrollY((s) => Math.min(maxScroll, s + Math.floor(viewHeight / 2)));
    if (input === 'u') setScrollY((s) => Math.max(0, s - Math.floor(viewHeight / 2)));
    if (key.pageDown) setScrollY((s) => Math.min(maxScroll, s + viewHeight));
    if (key.pageUp) setScrollY((s) => Math.max(0, s - viewHeight));
    if (input === 'g') setScrollY(0);
    if (input === 'G') setScrollY(maxScroll);
    if (input === 'q') process.exit(0);
  });

  const visibleLines = allLines.slice(scrollY, scrollY + viewHeight);
  const scrollPercent = maxScroll === 0 ? 100 : Math.round((scrollY / maxScroll) * 100);

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" paddingX={1}>
        {visibleLines.map(({ key, el }) => (
          <Box key={key}>{el}</Box>
        ))}
      </Box>
      <StatusBar filePath={filePath} scrollPercent={scrollPercent} />
    </Box>
  );
}
