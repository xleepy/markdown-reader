import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { wordWrap } from '../wordWrap.js';

export function renderBlockquote(token: Tokens.Blockquote, ti: number, width: number): React.ReactElement[] {
  const textWidth = Math.max(width - 2 - 4, 1); // -2 paddingX, -4 for '  │ '
  const elements: React.ReactElement[] = [];
  let li = 0;
  for (const line of wordWrap(token.text, textWidth)) {
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
