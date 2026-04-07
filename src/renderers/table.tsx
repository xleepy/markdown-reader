import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

type Align = 'left' | 'right' | 'center' | null;

// overhead per table = borders + padding: │ c1 │ c2 │ = 3*n + 1 chars
const tableOverhead = (numCols: number) => 3 * numCols + 1;

function clampColWidths(colWidths: number[], availableWidth: number): number[] {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const budget = availableWidth - tableOverhead(colWidths.length);

  if (total <= budget) return colWidths;

  // Distribute budget proportionally, minimum 3 chars per column
  return colWidths.map(w => Math.max(3, Math.floor((w / total) * budget)));
}

function truncate(text: string, width: number): string {
  return text.length <= width ? text : text.slice(0, width - 1) + '…';
}

function padCell(text: string, width: number, align: Align): string {
  const clipped = truncate(text, width);
  const pad = width - clipped.length;
  if (align === 'right') return clipped.padStart(width);
  if (align === 'center') {
    const left = Math.floor(pad / 2);
    return ' '.repeat(left) + clipped + ' '.repeat(pad - left);
  }
  return clipped.padEnd(width);
}

function row(cells: Tokens.TableCell[], colWidths: number[], aligns: Align[]): string {
  return '│ ' + cells.map((c, i) => padCell(c.text, colWidths[i], aligns[i])).join(' │ ') + ' │';
}

function border(type: 'top' | 'mid' | 'bottom', colWidths: number[]): string {
  const [l, m, r] = type === 'top' ? ['┌', '┬', '┐']
                  : type === 'mid' ? ['├', '┼', '┤']
                  :                  ['└', '┴', '┘'];
  return l + '─' + colWidths.map(w => '─'.repeat(w)).join('─' + m + '─') + '─' + r;
}

export function renderTable(token: Tokens.Table, ti: number, width: number): React.ReactElement[] {
  const naturalWidths = token.header.map((cell, ci) =>
    Math.max(cell.text.length, ...token.rows.map(r => r[ci]?.text.length ?? 0))
  );
  const colWidths = clampColWidths(naturalWidths, width - 2); // -2 for paddingX

  return [
    <Text key={`${ti}-tt`} color="gray">{border('top', colWidths)}</Text>,
    <Text key={`${ti}-th`} bold>{row(token.header, colWidths, token.align)}</Text>,
    <Text key={`${ti}-tm`} color="gray">{border('mid', colWidths)}</Text>,
    ...token.rows.map((cells, ri) => (
      <Text key={`${ti}-tr-${ri}`}>{row(cells, colWidths, token.align)}</Text>
    )),
    <Text key={`${ti}-tb`} color="gray">{border('bottom', colWidths)}</Text>,
    <Text key={`${ti}-sp`}> </Text>,
  ];
}
