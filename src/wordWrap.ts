export function* wordWrap(text: string, lineWidth: number): Generator<string> {
  if (lineWidth <= 0) { yield text; return; }
  const words = text.split(' ');
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= lineWidth) {
      current += ' ' + word;
    } else {
      yield current;
      current = word;
    }
  }
  yield current || '';
}
