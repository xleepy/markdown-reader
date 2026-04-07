import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

export function renderHeading(token: Tokens.Heading, ti: number): React.ReactElement[] {
  const color = token.depth === 1 ? 'cyan' : token.depth === 2 ? 'green' : 'yellow';
  return [
    <Text key={`${ti}-h`} bold color={color}>
      {'#'.repeat(token.depth)} {token.text}
    </Text>,
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
