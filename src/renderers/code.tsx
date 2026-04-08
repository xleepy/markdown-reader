import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import type { ThemedToken } from 'shiki';
import type { CodeHighlights } from '../highlight.js';

function truncateTokens(tokens: ThemedToken[], maxWidth: number): ThemedToken[] {
  const result: ThemedToken[] = [];
  let remaining = maxWidth;
  for (const t of tokens) {
    if (remaining <= 0) break;
    if (t.content.length <= remaining) {
      result.push(t);
      remaining -= t.content.length;
    } else {
      result.push({ ...t, content: t.content.slice(0, remaining) });
      remaining = 0;
    }
  }
  return result;
}

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
        {truncateTokens(lineTokens, innerWidth - 2).map((t: ThemedToken, j: number) => (
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
