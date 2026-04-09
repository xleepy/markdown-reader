import { describe, it, expect } from 'vitest';
import { renderList } from '../list.js';
import type { Tokens } from 'marked';
import type React from 'react';

type Props = Record<string, unknown>;
const props = (el: React.ReactElement) => el.props as Props;

function makeList(items: string[], ordered = false): Tokens.List {
  return {
    type: 'list',
    raw: '',
    ordered,
    start: ordered ? 1 : '',
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
    const els = renderList(makeList(['a', 'b', 'c']), 0, 80);
    expect(els).toHaveLength(4); // 3 items + spacer
  });

  it('uses bullet • for unordered lists', () => {
    const [first] = renderList(makeList(['item']), 0, 80);
    const text = JSON.stringify(props(first).children);
    expect(text).toContain('•');
  });

  it('uses numbers for ordered lists', () => {
    const [first] = renderList(makeList(['item'], true), 0, 80);
    const text = JSON.stringify(props(first).children);
    expect(text).toContain('1.');
  });

  it('renders nested unordered lists with increased indentation', () => {
    const token: Tokens.List = {
      type: 'list',
      raw: '',
      ordered: true,
      start: 1,
      loose: false,
      items: [
        {
          type: 'list_item',
          raw: '',
          task: false,
          checked: undefined,
          loose: false,
          text: 'Parent item:\n- child a\n- child b',
          tokens: [
            {
              type: 'text',
              raw: 'Parent item:',
              text: 'Parent item:',
              tokens: [{ type: 'text', raw: 'Parent item:', text: 'Parent item:' }],
            } as any,
            {
              type: 'list',
              raw: '',
              ordered: false,
              start: '',
              loose: false,
              items: [
                { type: 'list_item', raw: '', task: false, checked: undefined, loose: false, text: 'child a', tokens: [] },
                { type: 'list_item', raw: '', task: false, checked: undefined, loose: false, text: 'child b', tokens: [] },
              ],
            } as Tokens.List,
          ],
        },
        {
          type: 'list_item',
          raw: '',
          task: false,
          checked: undefined,
          loose: false,
          text: 'Second parent',
          tokens: [],
        },
      ],
    };

    const els = renderList(token, 0, 80);
    const lines = els.map((el) => {
      const c = props(el).children;
      return Array.isArray(c) ? c.join('') : String(c);
    });

    // Parent item should be present
    expect(lines[0]).toContain('1.');
    expect(lines[0]).toContain('Parent item:');

    // Nested children should appear with deeper indentation
    const childA = lines.find((l) => l.includes('child a'));
    const childB = lines.find((l) => l.includes('child b'));
    expect(childA).toBeDefined();
    expect(childB).toBeDefined();
    // Nested items have more leading whitespace than parent
    expect(childA!.search(/\S/)).toBeGreaterThan(lines[0].search(/\S/));
    expect(childB!.includes('•')).toBe(true);

    // Second parent should still render
    const secondParent = lines.find((l) => l.includes('Second parent'));
    expect(secondParent).toBeDefined();
    expect(secondParent).toContain('2.');
  });

  it('does not add trailing spacer for nested lists', () => {
    const token: Tokens.List = {
      type: 'list',
      raw: '',
      ordered: false,
      start: '',
      loose: false,
      items: [
        {
          type: 'list_item',
          raw: '',
          task: false,
          checked: undefined,
          loose: false,
          text: 'parent\n- nested',
          tokens: [
            { type: 'text', raw: 'parent', text: 'parent', tokens: [{ type: 'text', raw: 'parent', text: 'parent' }] } as any,
            {
              type: 'list',
              raw: '',
              ordered: false,
              start: '',
              loose: false,
              items: [
                { type: 'list_item', raw: '', task: false, checked: undefined, loose: false, text: 'nested', tokens: [] },
              ],
            } as Tokens.List,
          ],
        },
      ],
    };

    const els = renderList(token, 0, 80);
    const lines = els.map((el) => {
      const c = props(el).children;
      return Array.isArray(c) ? c.join('') : String(c);
    });

    // Should have: parent line, nested line, one trailing spacer (from root only)
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain('parent');
    expect(lines[1]).toContain('nested');
    // Last element is the root spacer
    expect(lines[2].trim()).toBe('');
  });
});
