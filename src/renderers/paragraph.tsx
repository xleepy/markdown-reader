import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

export function renderParagraph(token: Tokens.Paragraph, ti: number): React.ReactElement[] {
  return [
    <Text key={`${ti}-p`}>{token.text}</Text>,
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
