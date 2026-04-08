import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { wordWrap } from '../wordWrap.js';

export function renderParagraph(token: Tokens.Paragraph, ti: number, width: number): React.ReactElement[] {
  const textWidth = Math.max(width - 2, 1); // -2 for paddingX={1}
  const lines = wordWrap(token.text, textWidth);
  return [
    ...lines.map((line, li) => (
      <Text key={`${ti}-p-${li}`}>{line}</Text>
    )),
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
