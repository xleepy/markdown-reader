import { Text } from 'ink';
import type { Tokens } from 'marked';
import React from 'react';

type Align = 'left' | 'right' | 'center' | null;

function padCell(text: string, width: number, align: Align): string {
  const pad = width - text.length;
  if (align === 'right') return text.padStart(width);
  if (align === 'center') {
    const left = Math.floor(pad / 2);
    return ' '.repeat(left) + text + ' '.repeat(pad - left);
  }
  return text.padEnd(width);
}

function row(cells: Tokens.TableCell[], colWidths: number[], aligns: Align[]): string {
  return '│ ' + cells.map((c, i) => padCell(c.text, colWidths[i], aligns[i])).join(' │ ') + ' │';
}

function border(type: 'top' | 'mid' | 'bottom', colWidths: number[]): string {
  const [l, m, r] = type === 'top'    ? ['┌', '┬', '┐']
                  : type === 'mid'    ? ['├', '┼', '┤']
                  :                    ['└', '┴', '┘'];
  return l + '─' + colWidths.map(w => '─'.repeat(w)).join('─' + m + '─') + '─' + r;
}

export function renderTable(token: Tokens.Table, ti: number): React.ReactElement[] {
  const colWidths = token.header.map((cell, ci) =>
    Math.max(cell.text.length, ...token.rows.map(r => r[ci]?.text.length ?? 0))
  );

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
