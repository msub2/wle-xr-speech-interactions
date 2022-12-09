import { build } from 'esbuild';

build({
  entryPoints: ['./js/bundle.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'deploy/XRSpeechInteractions-bundle.js',
  platform: "browser",
}).catch(() => process.exit(1))