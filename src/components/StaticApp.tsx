import { Box, useStdout } from 'ink';
import type { Token } from 'marked';
import React from 'react';
import type { CodeHighlights } from '../highlight.js';
import { useAllLines } from '../tokenToLines.js';

interface StaticAppProps {
  tokens: Token[];
  codeHighlights: CodeHighlights;
}

export function StaticApp({ tokens, codeHighlights }: StaticAppProps) {
  const { stdout } = useStdout();
  const width = stdout.columns || 80;
  const allLines = useAllLines(tokens, width, codeHighlights);

  return (
    <Box flexDirection="column" paddingX={1}>
      {allLines.map(({ key, el }) => (
        <Box key={key}>{el}</Box>
      ))}
    </Box>
  );
}
