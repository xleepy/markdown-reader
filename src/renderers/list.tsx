import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

export function renderList(token: Tokens.List, ti: number): React.ReactElement[] {
  return [
    ...token.items.map((item: Tokens.ListItem, li: number) => (
      <Text key={`${ti}-li-${li}`}>
        {'  '}
        {token.ordered ? `${li + 1}.` : '•'} {item.text}
      </Text>
    )),
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
