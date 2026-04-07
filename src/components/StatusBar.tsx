import { Text, Box } from 'ink';
import React from 'react';

interface StatusBarProps {
  filePath: string;
  scrollPercent: number;
}

export function StatusBar({ filePath, scrollPercent }: StatusBarProps) {
  return (
    <Box justifyContent="space-between">
      <Text color="gray" dimColor>
        {' '}
        {filePath}{' '}
      </Text>
      <Text color="gray" dimColor>
        {scrollPercent}%{'  '}scroll/j/k ↑↓ · d/u half-page · g/G top/bot · q quit{' '}
      </Text>
    </Box>
  );
}
