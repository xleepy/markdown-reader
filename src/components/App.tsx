import React, { useState, useCallback } from 'react';
import { readFileSync } from 'fs';
import { marked } from 'marked';
import type { Token, Tokens } from 'marked';
import type { CodeHighlights } from '../highlight.js';
import { buildHighlights } from '../highlight.js';
import { ScrollableApp } from './ScrollableApp.js';
import { FileExplorer } from './FileExplorer.js';

interface AppProps {
  dirPath: string;
}

interface ViewerState {
  tokens: Token[];
  codeHighlights: CodeHighlights;
  filePath: string;
}

export function App({ dirPath }: AppProps) {
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  const handleSelectFile = useCallback((filePath: string) => {
    const raw = readFileSync(filePath, 'utf8');
    const tokens = marked.lexer(raw);
    const codeTokens = tokens.filter((t): t is Tokens.Code => t.type === 'code');
    buildHighlights(codeTokens).then(codeHighlights => {
      setViewer({ tokens, codeHighlights, filePath });
    });
  }, []);

  const handleBack = useCallback(() => {
    setViewer(null);
  }, []);

  if (viewer) {
    return (
      <ScrollableApp
        tokens={viewer.tokens}
        codeHighlights={viewer.codeHighlights}
        filePath={viewer.filePath}
        onBack={handleBack}
      />
    );
  }

  return <FileExplorer dirPath={dirPath} onSelectFile={handleSelectFile} />;
}
