const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const terser = require('@rollup/plugin-terser');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const pkg = require('./package.json');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: 'dist/vue-dnd-kit-devtools.global.js',
        format: 'iife',
        name: 'VueDndKitDevtools',
        sourcemap: true,
        globals: {
          vue: 'Vue',
          '@vue/devtools-api': 'VueDevtoolsApi',
        },
      },
      {
        file: 'dist/vue-dnd-kit-devtools.global.min.js',
        format: 'iife',
        name: 'VueDndKitDevtools',
        sourcemap: true,
        globals: {
          vue: 'Vue',
          '@vue/devtools-api': 'VueDevtoolsApi',
        },
        plugins: [terser()],
      },
    ],
    external: ['vue', '@vue/devtools-api'],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationDir: 'dist/types',
          },
          include: ['src/**/*.ts'],
          exclude: ['node_modules', 'dist'],
        },
        abortOnError: false,
      }),
      resolve(),
      commonjs(),
    ],
  },
];
