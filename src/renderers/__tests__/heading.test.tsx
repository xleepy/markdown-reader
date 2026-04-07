import { describe, it, expect } from 'vitest';
import { renderHeading } from '../heading.js';
import type { Tokens } from 'marked';

function makeHeading(depth: number, text: string): Tokens.Heading {
  return { type: 'heading', raw: `${'#'.repeat(depth)} ${text}\n`, depth, text, tokens: [] };
}

describe('renderHeading', () => {
  it('returns 2 elements (heading + spacer)', () => {
    const els = renderHeading(makeHeading(1, 'Hello'), 0);
    expect(els).toHaveLength(2);
  });

  it('uses cyan for h1', () => {
    const [el] = renderHeading(makeHeading(1, 'Hello'), 0);
    expect(el.props.color).toBe('cyan');
  });

  it('uses green for h2', () => {
    const [el] = renderHeading(makeHeading(2, 'Hello'), 0);
    expect(el.props.color).toBe('green');
  });

  it('uses yellow for h3+', () => {
    const [el] = renderHeading(makeHeading(3, 'Hello'), 0);
    expect(el.props.color).toBe('yellow');
  });

  it('is bold', () => {
    const [el] = renderHeading(makeHeading(1, 'Hello'), 0);
    expect(el.props.bold).toBe(true);
  });

  it('generates unique keys per token index', () => {
    const [a] = renderHeading(makeHeading(1, 'A'), 0);
    const [b] = renderHeading(makeHeading(1, 'B'), 1);
    expect(a.key).not.toBe(b.key);
  });
});
