import { Box, Text, useInput, useStdout } from 'ink';
import { readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import React, { useState, useMemo } from 'react';

interface FileExplorerProps {
  dirPath: string;
  onSelectFile: (filePath: string) => void;
}

interface Entry {
  name: string;
  isDirectory: boolean;
  fullPath: string;
}

function scanDirectory(dirPath: string): Entry[] {
  const entries: Entry[] = [];
  try {
    const items = readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith('.')) continue;
      if (item.isDirectory()) {
        entries.push({ name: item.name, isDirectory: true, fullPath: join(dirPath, item.name) });
      } else if (item.name.endsWith('.md') || item.name.endsWith('.markdown')) {
        entries.push({ name: item.name, isDirectory: false, fullPath: join(dirPath, item.name) });
      }
    }
  } catch {
    // ignore unreadable directories
  }
  const dirs = entries.filter(e => e.isDirectory).sort((a, b) => a.name.localeCompare(b.name));
  const files = entries.filter(e => !e.isDirectory).sort((a, b) => a.name.localeCompare(b.name));
  return [...dirs, ...files];
}

export function FileExplorer({ dirPath, onSelectFile }: FileExplorerProps) {
  const { stdout } = useStdout();
  const width = stdout.columns || 80;
  const height = stdout.rows || 24;

  const rootPath = useMemo(() => resolve(dirPath), [dirPath]);
  const [currentDir, setCurrentDir] = useState(() => resolve(dirPath));
  const [cursor, setCursor] = useState(0);

  const entries = useMemo(() => scanDirectory(currentDir), [currentDir]);

  const headerHeight = 3; // title + directory path + blank line
  const footerHeight = 1; // status bar
  const listHeight = Math.max(1, height - headerHeight - footerHeight);

  const scrollOffset = Math.max(0, Math.min(cursor - Math.floor(listHeight / 2), entries.length - listHeight));
  const visibleEntries = entries.slice(scrollOffset, scrollOffset + listHeight);

  useInput((input, key) => {
    if (key.downArrow || input === 'j') {
      setCursor(c => Math.min(c + 1, entries.length - 1));
    }
    if (key.upArrow || input === 'k') {
      setCursor(c => Math.max(c - 1, 0));
    }
    if (key.return) {
      const entry = entries[cursor];
      if (!entry) return;
      if (entry.isDirectory) {
        setCurrentDir(entry.fullPath);
        setCursor(0);
      } else {
        onSelectFile(entry.fullPath);
      }
    }
    if (key.backspace || input === '-') {
      const parent = dirname(currentDir);
      if (parent !== currentDir && currentDir.startsWith(rootPath + '/')) {
        setCurrentDir(parent);
        setCursor(0);
      }
    }
    if (input === 'q') process.exit(0);
  });

  const right = ' j/k ↑↓ navigate · Enter open · - back · q quit ';
  const leftMax = Math.max(0, width - right.length - 2);
  const displayDir = currentDir.length > leftMax
    ? '…' + currentDir.slice(-(leftMax - 1))
    : currentDir;
  const left = ` ${displayDir} `.padEnd(width - right.length);

  return (
    <Box flexDirection="column" height={height}>
      <Box flexDirection="column" paddingX={1}>
        <Text bold>Markdown Files</Text>
        <Text color="cyan">{currentDir}</Text>
        <Text> </Text>
      </Box>
      <Box flexDirection="column" paddingX={1} flexGrow={1} overflow="hidden">
        {entries.length === 0 ? (
          <Text dimColor>No markdown files found</Text>
        ) : (
          visibleEntries.map((entry, i) => {
            const index = scrollOffset + i;
            const isSelected = index === cursor;
            const prefix = entry.isDirectory ? '▸ ' : '  ';
            const label = entry.isDirectory ? `${entry.name}/` : entry.name;
            return (
              <Text
                key={entry.fullPath}
                inverse={isSelected}
                color={isSelected ? undefined : entry.isDirectory ? 'yellow' : undefined}
              >
                {prefix}{label}
              </Text>
            );
          })
        )}
      </Box>
      <Text color="gray" dimColor>{left}{right}</Text>
    </Box>
  );
}
