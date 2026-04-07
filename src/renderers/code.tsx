import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import type { ThemedToken } from 'shiki';
import type { CodeHighlights } from '../highlight.js';

export function renderCode(
  token: Tokens.Code,
  ti: number,
  width: number,
  codeHighlights: CodeHighlights
): React.ReactElement[] {
  const innerWidth = Math.max(10, width - 6);
  const highlighted =
    codeHighlights.get(token.raw) ??
    token.text.split('\n').map((line: string) => [{ content: line, offset: 0 }]);

  return [
    <Text key={`${ti}-ct`} color="gray">
      {'  ╭' + '─'.repeat(innerWidth) + '╮'}
    </Text>,
    ...highlighted.map((lineTokens: ThemedToken[], li: number) => (
      <Text key={`${ti}-cl-${li}`}>
        {'  │ '}
        {lineTokens.map((t: ThemedToken, j: number) => (
          <Text key={j} color={t.color ?? undefined}>
            {t.content}
          </Text>
        ))}
      </Text>
    )),
    <Text key={`${ti}-cb`} color="gray">
      {'  ╰' + '─'.repeat(innerWidth) + '╯'}
    </Text>,
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
