// rollup.config.js
import path from 'path';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const pathSrc = {
  root: "./html/guide",
  scss: "./resources/scss",
  css: "./test/css",
};

export default {
  input: pathSrc.scss + '/styles.scss',
  output: {
    file: pathSrc.css + '/bundle.js',
    format: 'iife',
  },
  plugins: [
    sass({
      output: pathSrc.css + '/styles.css',
      options: {
        includePaths: [path.resolve(path.dirname(''), pathSrc.scss)],
      },
    }),
    serve({
      open: true,
      contentBase: pathSrc.root,
      port: 8080,
    }),
    livereload({
      watch: pathSrc.root,
    }),
  ],
};
