import { Text } from 'ink';
import React from 'react';

interface StatusBarProps {
  filePath: string;
  scrollPercent: number;
  width: number;
}

export function StatusBar({ filePath, scrollPercent, width }: StatusBarProps) {
  const right = `${scrollPercent}%  scroll/j/k ↑↓ · d/u half-page · g/G top/bot · q quit `;
  const leftMax = Math.max(0, width - right.length - 2); // 2 for surrounding spaces
  const displayPath = filePath.length > leftMax
    ? '…' + filePath.slice(-(leftMax - 1))
    : filePath;
  const left = ` ${displayPath} `.padEnd(width - right.length);

  return (
    <Text color="gray" dimColor>{left}{right}</Text>
  );
}
