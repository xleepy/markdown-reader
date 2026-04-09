import { Text } from 'ink';
import type { Token, Tokens } from 'marked';
import React from 'react';
import { extractPlainText } from '../inlineText.js';
import { wordWrap } from '../wordWrap.js';

function blockquoteText(tokens: Token[]): string {
  return (tokens as any[])
    .map(t => t.tokens ? extractPlainText(t.tokens) : t.text ?? '')
    .join('\n');
}

export function renderBlockquote(token: Tokens.Blockquote, ti: number, width: number): React.ReactElement[] {
  const textWidth = Math.max(width - 2 - 4, 1); // -2 paddingX, -4 for '  │ '
  const elements: React.ReactElement[] = [];
  let li = 0;
  const text = token.tokens?.length ? blockquoteText(token.tokens) : token.text;
  for (const line of wordWrap(text, textWidth)) {
    elements.push(
      <Text key={`${ti}-bq-${li++}`}>
        {'  '}
        <Text color="gray">│</Text>{' '}
        <Text color="gray" italic>
          {line}
        </Text>
      </Text>
    );
  }
  elements.push(<Text key={`${ti}-sp`}> </Text>);
  return elements;
}
