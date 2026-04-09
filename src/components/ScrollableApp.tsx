import { Box, useInput, useStdout } from 'ink';
import type { Token } from 'marked';
import React from 'react';
import type { CodeHighlights } from '../highlight.js';
import { useInertialScroll } from '../hooks/useInertialScroll.js';
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

  const allLines = useAllLines(tokens, width, codeHighlights);
  const maxScroll = Math.max(0, allLines.length - viewHeight);

  const { scrollY, addVelocity, jumpTo, scrollBy } = useInertialScroll(maxScroll);

  useMouseScroll((direction) => addVelocity(direction));

  useInput((input, key) => {
    if (key.downArrow || input === 'j') scrollBy(1);
    if (key.upArrow || input === 'k') scrollBy(-1);
    if (input === 'd') scrollBy(Math.floor(viewHeight / 2));
    if (input === 'u') scrollBy(-Math.floor(viewHeight / 2));
    if (key.pageDown) scrollBy(viewHeight);
    if (key.pageUp) scrollBy(-viewHeight);
    if (input === 'g') jumpTo(0);
    if (input === 'G') jumpTo(maxScroll);
    if (input === 'q') process.exit(0);
  });

  const visibleLines = allLines.slice(scrollY, scrollY + viewHeight);
  const scrollPercent = maxScroll === 0 ? 100 : Math.round((scrollY / maxScroll) * 100);

  return (
    <Box flexDirection="column" height={height}>
      <Box flexDirection="column" paddingX={1} flexGrow={1} overflow="hidden">
        {visibleLines.map(({ key, el }) => (
          <Box key={key}>{el}</Box>
        ))}
      </Box>
      <StatusBar filePath={filePath} scrollPercent={scrollPercent} width={width} />
    </Box>
  );
}
