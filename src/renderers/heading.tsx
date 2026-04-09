import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { extractPlainText } from '../inlineText.js';
import { wordWrap } from '../wordWrap.js';

export function renderHeading(token: Tokens.Heading, ti: number, width: number): React.ReactElement[] {
  const color = token.depth === 1 ? 'cyan' : token.depth === 2 ? 'green' : 'yellow';
  const prefix = '#'.repeat(token.depth) + ' ';
  const indent = ' '.repeat(prefix.length);
  const textWidth = Math.max(width - 2 - prefix.length, 1);
  const elements: React.ReactElement[] = [];
  let li = 0;
  for (const chunk of wordWrap(extractPlainText(token.tokens ?? []) || token.text, textWidth)) {
    elements.push(
      <Text key={`${ti}-h-${li}`} bold color={color}>
        {(li === 0 ? prefix : indent) + chunk}
      </Text>
    );
    li++;
  }
  elements.push(<Text key={`${ti}-sp`}> </Text>);
  return elements;
}
