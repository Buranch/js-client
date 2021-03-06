const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const filesize = require('rollup-plugin-filesize');

const pkg = require('./package.json');
const env = process.env.NODE_ENV || 'development';
const version = process.env.npm_package_version;

let plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
    VERSION: JSON.stringify(version),
  }),
  globals(),
  builtins(),
  resolve({
    module: true,
    jsnext: true,
    main: true,
    preferBuiltins: true,
  }),
  commonjs(),
  babel(),
  filesize(),
];

if (env === 'production') {
  plugins = plugins.concat(
    uglify({
      compress: {},
    })
  );
}

const config = {
  plugins,
  input: 'src/index.js',
  output: [
    {
      plugins,
      name: 'LDClient',
      file: process.env.NODE_ENV === 'production' ? './dist/ldclient.min.js' : './dist/ldclient.js',
      format: 'umd',
      sourcemap: true,
    },
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
};

module.exports = config;
