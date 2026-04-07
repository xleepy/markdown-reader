import type { Token, Tokens } from 'marked';
import { useMemo } from 'react';
import React from 'react';
import type { CodeHighlights } from './highlight.js';
import { renderHeading } from './renderers/heading.js';
import { renderParagraph } from './renderers/paragraph.js';
import { renderCode } from './renderers/code.js';
import { renderList } from './renderers/list.js';
import { renderBlockquote } from './renderers/blockquote.js';
import { renderHr } from './renderers/hr.js';

export function tokenToLines(
  token: Token,
  width: number,
  ti: number,
  codeHighlights: CodeHighlights
): React.ReactElement[] {
  switch (token.type) {
    case 'heading':    return renderHeading(token as Tokens.Heading, ti);
    case 'paragraph':  return renderParagraph(token as Tokens.Paragraph, ti);
    case 'code':       return renderCode(token as Tokens.Code, ti, width, codeHighlights);
    case 'list':       return renderList(token as Tokens.List, ti);
    case 'blockquote': return renderBlockquote(token as Tokens.Blockquote, ti);
    case 'hr':         return renderHr(ti, width);
    default:           return [];
  }
}

export function useAllLines(
  tokens: Token[],
  width: number,
  codeHighlights: CodeHighlights
) {
  return useMemo(
    () =>
      tokens.flatMap((token, ti) =>
        tokenToLines(token, width, ti, codeHighlights).map((el, li) => ({
          key: `${ti}-${li}`,
          el,
        }))
      ),
    [tokens, width, codeHighlights]
  );
}
