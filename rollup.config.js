import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const inputPath = 'src/anime.js';
const outputName = 'anime';

const banner = format => {
  const date = new Date();
  return `/*
  * anime.js v${ pkg.version } - ${ format }
  * (c) ${ date.getFullYear() } Julian Garnier
  * Released under the MIT license
  * animejs.com
*/
`;
}

const replaceOptions = {
  __packageVersion__: pkg.version,
  preventAssignment: true
}

const babelOptions = {
  presets: ["@babel/preset-env"],
  babelHelpers: 'bundled',
}

export default [
  // ES6 UMD & Module
  {
    input: inputPath,
    output: [
      { file: pkg.main, format: 'umd', name: outputName, banner: banner('ES6 UMD') },
      { file: pkg.module, format: 'esm', banner: banner('ES6 ESM') }
    ],
    plugins: [
      replace(replaceOptions),
      // notify()
    ]
  },
  // ES5 Minified
  {
    input: inputPath,
    output: { file: pkg.files + '/anime.es5.min.js', format: 'iife', name: outputName, banner: banner('ES5 IIFE') },
    plugins: [
      replace(replaceOptions),
      babel(babelOptions),
      terser(),
      // uglify({
      //   output: {
      //     preamble: banner('ES5 IIFE minified')
      //   }
      // }),
      // notify()
    ]
  },
  // ES5 
  {
    input: inputPath,
    output: { file: pkg.files + '/anime.es5.js', format: 'iife', name: outputName, banner: banner('ES5 IIFE') },
    plugins: [
      replace(replaceOptions),
      babel(babelOptions),
      // notify()
    ]
  },
];
