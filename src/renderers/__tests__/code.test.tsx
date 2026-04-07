import { describe, it, expect } from 'vitest';
import { renderCode } from '../code.js';
import type { Tokens } from 'marked';

function makeCode(text: string, lang = 'javascript'): Tokens.Code {
  return { type: 'code', raw: `\`\`\`${lang}\n${text}\n\`\`\`\n`, text, lang };
}

describe('renderCode', () => {
  it('returns top border + N code lines + bottom border + spacer', () => {
    const token = makeCode('line1\nline2\nline3');
    const els = renderCode(token, 0, 80, new Map());
    // top + 3 lines + bottom + spacer = 6
    expect(els).toHaveLength(6);
  });

  it('uses highlighted lines from codeHighlights map', () => {
    const token = makeCode('const x = 1');
    const highlights = new Map([
      [token.raw, [[{ content: 'const', color: '#81a1c1', offset: 0 }, { content: ' x = 1', offset: 5 }]]],
    ]);
    const els = renderCode(token, 0, 80, highlights);
    // top + 1 line + bottom + spacer = 4
    expect(els).toHaveLength(4);
  });

  it('falls back to plain lines when codeHighlights has no entry', () => {
    const token = makeCode('a\nb');
    const els = renderCode(token, 0, 80, new Map());
    // top + 2 lines + bottom + spacer = 5
    expect(els).toHaveLength(5);
  });
});
