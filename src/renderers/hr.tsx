import { Text } from 'ink';
import React from 'react';

export function renderHr(ti: number, width: number): React.ReactElement[] {
  return [
    <Text key={`${ti}-hr`} color="gray">
      {'─'.repeat(width - 2)}
    </Text>,
  ];
}
