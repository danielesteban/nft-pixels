import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

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
      __ContractAddress__: JSON.stringify(process.env.ADDRESS),
    }),
    ...(production ? [terser()] : [livereload(path.join(__dirname, 'dist'))]),
  ],
  watch: {
    clearScreen: false,
  },
};
