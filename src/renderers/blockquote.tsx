import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { wordWrap } from '../wordWrap.js';

export function renderBlockquote(token: Tokens.Blockquote, ti: number, width: number): React.ReactElement[] {
  const prefixWidth = 4; // '  │ '
  const textWidth = Math.max(width - 2 - prefixWidth, 1); // -2 for paddingX={1}
  const lines = wordWrap(token.text, textWidth);
  return [
    ...lines.map((line, li) => (
      <Text key={`${ti}-bq-${li}`}>
        {'  '}
        <Text color="gray">│</Text>{' '}
        <Text color="gray" italic>
          {line}
        </Text>
      </Text>
    )),
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
