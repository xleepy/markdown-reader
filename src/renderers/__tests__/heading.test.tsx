import { describe, it, expect } from 'vitest';
import { renderHeading } from '../heading.js';
import type { Tokens } from 'marked';
import type React from 'react';

type Props = Record<string, unknown>;
const props = (el: React.ReactElement) => el.props as Props;

function makeHeading(depth: number, text: string): Tokens.Heading {
  return { type: 'heading', raw: `${'#'.repeat(depth)} ${text}\n`, depth, text, tokens: [] };
}

describe('renderHeading', () => {
  it('returns 2 elements (heading + spacer) for short text', () => {
    const els = renderHeading(makeHeading(1, 'Hello'), 0, 80);
    expect(els).toHaveLength(2);
  });

  it('uses cyan for h1', () => {
    const [el] = renderHeading(makeHeading(1, 'Hello'), 0, 80);
    expect(props(el).color).toBe('cyan');
  });

  it('uses green for h2', () => {
    const [el] = renderHeading(makeHeading(2, 'Hello'), 0, 80);
    expect(props(el).color).toBe('green');
  });

  it('uses yellow for h3+', () => {
    const [el] = renderHeading(makeHeading(3, 'Hello'), 0, 80);
    expect(props(el).color).toBe('yellow');
  });

  it('is bold', () => {
    const [el] = renderHeading(makeHeading(1, 'Hello'), 0, 80);
    expect(props(el).bold).toBe(true);
  });

  it('generates unique keys per token index', () => {
    const [a] = renderHeading(makeHeading(1, 'A'), 0, 80);
    const [b] = renderHeading(makeHeading(1, 'B'), 1, 80);
    expect(a.key).not.toBe(b.key);
  });

  it('wraps long headings into multiple Text elements + spacer', () => {
    const longText = 'AP-42244 — PLAN | Usage Differentiation | Extend action/operation copy/paste to include UD';
    const els = renderHeading(makeHeading(1, longText), 0, 80);
    // Should be more than 1 heading line + 1 spacer
    expect(els.length).toBeGreaterThan(2);
    // Last element is the spacer
    expect(props(els[els.length - 1]).children).toBe(' ');
    // Continuation lines are indented to align with text after '# '
    const secondLine = props(els[1]).children as string;
    expect(secondLine.startsWith('  ')).toBe(true);
  });
});
