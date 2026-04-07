import { describe, it, expect } from 'vitest';
import { renderList } from '../list.js';
import type { Tokens } from 'marked';

function makeList(items: string[], ordered = false): Tokens.List {
  return {
    type: 'list',
    raw: '',
    ordered,
    start: ordered ? 1 : false,
    loose: false,
    items: items.map((text) => ({
      type: 'list_item',
      raw: '',
      task: false,
      checked: undefined,
      loose: false,
      text,
      tokens: [],
    })),
  };
}

describe('renderList', () => {
  it('returns one element per item plus a spacer', () => {
    const els = renderList(makeList(['a', 'b', 'c']), 0);
    expect(els).toHaveLength(4); // 3 items + spacer
  });

  it('uses bullet • for unordered lists', () => {
    const [first] = renderList(makeList(['item']), 0);
    const text = JSON.stringify(first.props.children);
    expect(text).toContain('•');
  });

  it('uses numbers for ordered lists', () => {
    const [first] = renderList(makeList(['item'], true), 0);
    const text = JSON.stringify(first.props.children);
    expect(text).toContain('1.');
  });
});
