export function* wordWrap(text: string, lineWidth: number): Generator<string> {
  if (lineWidth <= 0) { yield text; return; }
  for (const segment of text.split('\n')) {
    const words = segment.split(' ');
    let current = '';
    for (const word of words) {
      if (word.length > lineWidth) {
        if (current) { yield current; current = ''; }
        for (let i = 0; i < word.length; i += lineWidth) yield word.slice(i, i + lineWidth);
      } else if (!current) {
        current = word;
      } else if (current.length + 1 + word.length <= lineWidth) {
        current += ' ' + word;
      } else {
        yield current;
        current = word;
      }
    }
    yield current;
  }
}
