import { describe, it, expect } from 'vitest';
import { renderTable } from '../table.js';
import type { Tokens } from 'marked';
import type React from 'react';

type Props = Record<string, unknown>;
const props = (el: React.ReactElement) => el.props as Props;

function makeTable(
  headers: string[],
  rows: string[][],
  align: Array<'left' | 'right' | 'center' | null> = []
): Tokens.Table {
  const aligns = headers.map((_, i) => align[i] ?? null);
  return {
    type: 'table',
    raw: '',
    align: aligns,
    header: headers.map((text, i) => ({ text, tokens: [], header: true, align: aligns[i] })),
    rows: rows.map(row =>
      row.map((text, i) => ({ text, tokens: [], header: false, align: aligns[i] }))
    ),
  };
}

describe('renderTable', () => {
  it('returns top + header + mid + N rows + bottom + spacer', () => {
    const els = renderTable(makeTable(['A', 'B'], [['1', '2'], ['3', '4']]), 0);
    expect(els).toHaveLength(7); // top + header + mid + 2 rows + bottom + spacer
  });

  it('pads columns to the widest cell', () => {
    const els = renderTable(makeTable(['Name', 'Val'], [['longer text', '1']]), 0);
    const headerText = props(els[1]).children as string;
    expect(headerText).toContain('Name       '); // padded to 'longer text' width
  });

  it('right-aligns cells when align is right', () => {
    const els = renderTable(makeTable(['Num'], [['1'], ['999']], ['right']), 0);
    const rowText = props(els[3]).children as string;
    expect(rowText).toBe('│   1 │');
  });

  it('generates unique keys per token index', () => {
    const a = renderTable(makeTable(['X'], [['1']]), 0);
    const b = renderTable(makeTable(['X'], [['1']]), 1);
    expect(a[0].key).not.toBe(b[0].key);
  });
});
