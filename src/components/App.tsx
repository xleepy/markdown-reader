import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
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

  const [error, setError] = useState<string | null>(null);

  const handleSelectFile = useCallback((filePath: string) => {
    let raw: string;
    try {
      raw = readFileSync(filePath, 'utf8');
    } catch (err) {
      setError(`Cannot read file: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    const tokens = marked.lexer(raw);
    const codeTokens = tokens.filter((t): t is Tokens.Code => t.type === 'code');
    buildHighlights(codeTokens)
      .then(codeHighlights => {
        setViewer({ tokens, codeHighlights, filePath });
      })
      .catch((err: unknown) => {
        setError(`Failed to load file: ${err instanceof Error ? err.message : String(err)}`);
      });
  }, []);

  const handleBack = useCallback(() => {
    setViewer(null);
    setError(null);
  }, []);

  if (error) {
    return <ErrorScreen message={error} onDismiss={() => setError(null)} />;
  }

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

function ErrorScreen({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useInput(() => onDismiss());
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="red">Error: {message}</Text>
      <Text dimColor>Press any key to return to the explorer.</Text>
    </Box>
  );
}
