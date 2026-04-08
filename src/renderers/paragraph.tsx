import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { wordWrap } from '../wordWrap.js';

export function renderParagraph(token: Tokens.Paragraph, ti: number, width: number): React.ReactElement[] {
  const textWidth = Math.max(width - 2, 1);
  const elements: React.ReactElement[] = [];
  let li = 0;
  for (const line of wordWrap(token.text, textWidth)) {
    elements.push(<Text key={`${ti}-p-${li++}`}>{line}</Text>);
  }
  elements.push(<Text key={`${ti}-sp`}> </Text>);
  return elements;
}
