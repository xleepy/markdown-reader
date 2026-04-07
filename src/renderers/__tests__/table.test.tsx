import { describe, it, expect } from 'vitest';
import { renderTable } from '../table.js';
import type { Tokens } from 'marked';
import type React from 'react';

type Props = Record<string, unknown>;
const props = (el: React.ReactElement) => el.props as Props;

const WIDTH = 80;

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
    const els = renderTable(makeTable(['A', 'B'], [['1', '2'], ['3', '4']]), 0, WIDTH);
    expect(els).toHaveLength(7); // top + header + mid + 2 rows + bottom + spacer
  });

  it('pads columns to the widest cell', () => {
    const els = renderTable(makeTable(['Name', 'Val'], [['longer text', '1']]), 0, WIDTH);
    const headerText = props(els[1]).children as string;
    expect(headerText).toContain('Name       '); // padded to 'longer text' width
  });

  it('right-aligns cells when align is right', () => {
    const els = renderTable(makeTable(['Num'], [['1'], ['999']], ['right']), 0, WIDTH);
    const rowText = props(els[3]).children as string;
    expect(rowText).toBe('│   1 │');
  });

  it('generates unique keys per token index', () => {
    const a = renderTable(makeTable(['X'], [['1']]), 0, WIDTH);
    const b = renderTable(makeTable(['X'], [['1']]), 1, WIDTH);
    expect(a[0].key).not.toBe(b[0].key);
  });

  it('clamps column widths to fit within the terminal width', () => {
    const longHeader = 'A'.repeat(50);
    const els = renderTable(makeTable([longHeader, longHeader], [['x', 'y']]), 0, 40);
    const topBorder = props(els[0]).children as string;
    expect(topBorder.length).toBeLessThanOrEqual(40);
  });

  it('truncates cell text with … when column is clamped', () => {
    const els = renderTable(makeTable(['Col'], [['a very long value that will not fit']]), 0, 20);
    const rowText = props(els[3]).children as string;
    expect(rowText).toContain('…');
  });
});
