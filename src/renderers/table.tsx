import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';
import { extractPlainText } from '../inlineText.js';
import { wordWrap } from '../wordWrap.js';

type Align = 'left' | 'right' | 'center' | null;

// overhead per table = borders + padding: │ c1 │ c2 │ = 3*n + 1 chars
const tableOverhead = (numCols: number) => 3 * numCols + 1;

function clampColWidths(colWidths: number[], availableWidth: number): number[] {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const budget = availableWidth - tableOverhead(colWidths.length);

  if (total <= budget) return colWidths;

  // Give each column a guaranteed minimum, then distribute the rest proportionally.
  // Using Math.max(3, proportional) alone can push the total over budget when small
  // columns get bumped up to the minimum.
  const MIN = 3;
  const remaining = budget - MIN * colWidths.length;
  if (remaining <= 0) return colWidths.map(() => MIN);

  return colWidths.map(w => MIN + Math.floor((w / total) * remaining));
}

function wrapCell(text: string, width: number): string[] {
  return [...wordWrap(text, width)];
}

function padLine(line: string, width: number, align: Align): string {
  const pad = width - line.length;
  if (align === 'right') return line.padStart(width);
  if (align === 'center') {
    const left = Math.floor(pad / 2);
    return ' '.repeat(left) + line + ' '.repeat(pad - left);
  }
  return line.padEnd(width);
}

function rowLines(cells: Tokens.TableCell[], colWidths: number[], aligns: Align[]): string[] {
  const wrapped = cells.map((c, i) => wrapCell(extractPlainText(c.tokens ?? []) || c.text, colWidths[i]));
  const numLines = Math.max(...wrapped.map(l => l.length));
  const result: string[] = [];
  for (let li = 0; li < numLines; li++) {
    result.push('│ ' + wrapped.map((lines, i) => padLine(lines[li] ?? '', colWidths[i], aligns[i])).join(' │ ') + ' │');
  }
  return result;
}

function border(type: 'top' | 'mid' | 'bottom', colWidths: number[]): string {
  const [l, m, r] = type === 'top' ? ['┌', '┬', '┐']
    : type === 'mid' ? ['├', '┼', '┤']
      : ['└', '┴', '┘'];
  return l + '─' + colWidths.map(w => '─'.repeat(w)).join('─' + m + '─') + '─' + r;
}

export function renderTable(token: Tokens.Table, ti: number, width: number): React.ReactElement[] {
  const cellText = (c: Tokens.TableCell) => extractPlainText(c.tokens ?? []) || c.text;
  const naturalWidths = token.header.map((cell, ci) =>
    Math.max(cellText(cell).length, ...token.rows.map(r => r[ci] ? cellText(r[ci]).length : 0))
  );
  const colWidths = clampColWidths(naturalWidths, width - 2); // -2 for paddingX

  const headerLines = rowLines(token.header, colWidths, token.align);

  return [
    <Text key={`${ti}-tt`} color="gray">{border('top', colWidths)}</Text>,
    ...headerLines.map((line, li) => (
      <Text key={`${ti}-th-${li}`} bold>{line}</Text>
    )),
    <Text key={`${ti}-tm`} color="gray">{border('mid', colWidths)}</Text>,
    ...token.rows.flatMap((cells, ri) => [
      ...rowLines(cells, colWidths, token.align).map((line, li) => (
        <Text key={`${ti}-tr-${ri}-${li}`}>{line}</Text>
      )),
      ...(ri < token.rows.length - 1
        ? [<Text key={`${ti}-tr-${ri}-sep`} color="gray">{border('mid', colWidths)}</Text>]
        : []),
    ]),
    <Text key={`${ti}-tb`} color="gray">{border('bottom', colWidths)}</Text>,
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
