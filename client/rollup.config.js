import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

require('dotenv').config();

export default {
  input: path.join(__dirname, 'src', 'main.js'),
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: path.join(__dirname, 'dist', 'bundle.js'),
  },
  plugins: [
    svelte({
      dev: !production,
      css: (css) => css.write(path.join(__dirname, 'dist', 'bundle.css')),
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    json(),
    replace({
      __NetworkId__: JSON.stringify(process.env.NETWORK_ID),
      __OffersAddress__: JSON.stringify(process.env.OFFERS_ADDRESS),
      __TokensAddress__: JSON.stringify(process.env.TOKENS_ADDRESS),
    }),
    ...(production ? [terser()] : [livereload(path.join(__dirname, 'dist'))]),
  ],
  watch: {
    clearScreen: false,
  },
};
