import { codeToTokens, bundledLanguages, isSpecialLang } from 'shiki';
import type { ThemedToken, BundledLanguage } from 'shiki';
import type { Tokens } from 'marked';

export type CodeHighlights = Map<string, ThemedToken[][]>;

export async function buildHighlights(tokens: Tokens.Code[]): Promise<CodeHighlights> {
  const highlights: CodeHighlights = new Map();

  await Promise.all(
    tokens.map(async (t) => {
      try {
        const lang =
          t.lang && (isSpecialLang(t.lang) || t.lang in bundledLanguages)
            ? (t.lang as BundledLanguage)
            : 'text';
        const result = await codeToTokens(t.text, { lang, theme: 'nord' });
        highlights.set(t.raw, result.tokens);
      } catch {
        highlights.set(
          t.raw,
          t.text.split('\n').map((line: string) => [{ content: line, offset: 0 }])
        );
      }
    })
  );

  return highlights;
}
