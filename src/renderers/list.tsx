import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { extractPlainText } from '../inlineText.js';
import { wordWrap } from '../wordWrap.js';

function itemText(item: Tokens.ListItem): string {
  if (!item.tokens?.length) return item.text;
  return (item.tokens as any[])
    .filter(t => t.type !== 'list')
    .map(t => t.tokens ? extractPlainText(t.tokens) : t.text ?? '')
    .join('\n');
}

function nestedLists(item: Tokens.ListItem): Tokens.List[] {
  if (!item.tokens?.length) return [];
  return (item.tokens as any[]).filter(t => t.type === 'list');
}

export function renderList(
  token: Tokens.List,
  ti: number,
  width: number,
  depth: number = 0
): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  const depthIndent = '    '.repeat(depth);
  const start = token.ordered && typeof token.start === 'number' ? token.start : 1;
  for (let li = 0; li < token.items.length; li++) {
    const item = token.items[li];
    const bullet = token.ordered ? `${start + li}.` : '•';
    const prefix = `${depthIndent}  ${bullet} `;
    const indent = ' '.repeat(prefix.length);
    const textWidth = Math.max(width - 2 - prefix.length, 1);
    let wi = 0;
    for (const line of wordWrap(itemText(item), textWidth)) {
      elements.push(
        <Text key={`${ti}-li-${depth}-${li}-${wi}`}>
          {wi === 0 ? prefix : indent}{line}
        </Text>
      );
      wi++;
    }
    for (const nested of nestedLists(item)) {
      elements.push(...renderList(nested, ti, width, depth + 1));
    }
  }
  if (depth === 0) {
    elements.push(<Text key={`${ti}-sp`}> </Text>);
  }
  return elements;
}
