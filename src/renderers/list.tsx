import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { wordWrap } from '../wordWrap.js';

export function renderList(token: Tokens.List, ti: number, width: number): React.ReactElement[] {
  return [
    ...token.items.flatMap((item: Tokens.ListItem, li: number) => {
      const bullet = token.ordered ? `${li + 1}.` : '•';
      const prefix = `  ${bullet} `;
      const indent = ' '.repeat(prefix.length);
      const textWidth = Math.max(width - 2 - prefix.length, 1); // -2 for paddingX={1}
      const lines = wordWrap(item.text, textWidth);
      return lines.map((line, wi) => (
        <Text key={`${ti}-li-${li}-${wi}`}>
          {wi === 0 ? prefix : indent}{line}
        </Text>
      ));
    }),
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
