import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

function wordWrap(text: string, lineWidth: number): string[] {
  if (lineWidth <= 0) return [text];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= lineWidth) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function renderHeading(token: Tokens.Heading, ti: number, width: number): React.ReactElement[] {
  const color = token.depth === 1 ? 'cyan' : token.depth === 2 ? 'green' : 'yellow';
  const prefix = '#'.repeat(token.depth) + ' ';
  const indent = ' '.repeat(prefix.length);
  const textWidth = Math.max(width - 2 - prefix.length, 1); // -2 for paddingX={1}
  const chunks = wordWrap(token.text, textWidth);

  const elements: React.ReactElement[] = chunks.map((chunk, li) => (
    <Text key={`${ti}-h-${li}`} bold color={color}>
      {(li === 0 ? prefix : indent) + chunk}
    </Text>
  ));
  elements.push(<Text key={`${ti}-sp`}> </Text>);
  return elements;
}
