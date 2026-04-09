import type { Token } from 'marked';

export function extractPlainText(tokens: Token[]): string {
  return tokens.map(t => {
    const tt = t as any;
    switch (t.type) {
      case 'br': return '\n';
      case 'codespan':
      case 'escape': return tt.text ?? '';
      default:
        if (tt.tokens) return extractPlainText(tt.tokens);
        return tt.text ?? '';
    }
  }).join('');
}
