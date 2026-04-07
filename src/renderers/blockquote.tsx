import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

export function renderBlockquote(token: Tokens.Blockquote, ti: number): React.ReactElement[] {
  return [
    <Text key={`${ti}-bq`}>
      {'  '}
      <Text color="gray">│</Text>{' '}
      <Text color="gray" italic>
        {token.text}
      </Text>
    </Text>,
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
