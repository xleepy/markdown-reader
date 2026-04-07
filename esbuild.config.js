import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  // Keep npm dependencies external — they'll be installed alongside dist/
  external: ['ink', 'react', 'marked', 'shiki'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
