# 범정부 2차 테스트

### 폴더구조
```bash

html/
├── guide/
│   ├── component/
│   │   ├── code/
│   ├── foundation/
│   ├── global/
│   │   ├── code/
│   ├── layout/
│   ├── outline/
│   ├── search/
│   ├── service/
│   ├── style/
├── pattern/
│   ├── layout/ 

resources/
├── css/
│   ├── guide/
│   ├── output/
├── file/
├── fonts/
├── guide/
│   ├── css/
├── img/
│   ├── component/
│   │   ├── common/
│   ├── guide/
│   │   ├── common/
│   │   ├── contents/
│   ├── pattern/
│   │   ├── common/
│   │   ├── contents/
│   │   ├── layout/
│   │   ├── sample/
├── js/
│   ├── component/
│   ├── guide/
│   ├── pattern/
├── scss/
│   ├── component/
│   │   ├── components/
│   │   ├── forms/
│   │   ├── mixins/
│   ├── guide/
│   ├── pattern/

* 신규추가
tokens/ 피그마토큰
transform/ 스타일딕셔너리설정

*npm publish
dist/
├── css/
├── js/

src/
├── js/
│   ├── component/
├── scss/
│   ├── component/
│   │   ├── components/
│   │   ├── forms/
│   │   ├── mixins/
│   ├── guide/
│   ├── pattern/

```

---

### 번들링
```bash
* test 버전(현재)의 번들링은 gulp

* Rollup
- 페이스북(react)의 기본 패키지
- Google material: rollup(https://rollupjs.org/)
- 프랑스: rollup
- shopify polaris: rollup
- focus-trap: rollup
- Pinterest Gestalt: https://gestalt.pinterest.systems/home
- 싱가폴 리액트 컴포넌트

* vite
- Twilio Paste: https://paste.twilio.design/

* Gulp
- 영국정부 GOV UK: gulp
- salesforce: gulp

* Bundler
- 미국정부 USWDS: Bundler v2.2.0(https://bundler.io/)

* parcel
- atlassian: parcel / webpack

* webpack
- IBM carbon : carbondesignsystem.com

```

---

### test 버전(현재) gulp / gulpfile.js
```js
"use strict";

// plug-in
const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const browserSync = require("browser-sync").create();
const header = require('gulp-header');

// path
const path = require('path');
const rootPath = path.resolve(__dirname);
const charset = '@charset "utf-8";\n\n';
const pathSrc = {
  root: "./html/guide",
  scss: "./resources/scss",
  css: "./build/css",
};

// 배포 폴더 삭제
gulp.task("clean", function () {
  return import("del").then((del) => {
    return del.deleteAsync([pathSrc.css]);
  });
});

// sass
gulp.task("sass", function() {
  return gulp.src(pathSrc.scss + "/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(header(charset))
    .pipe(gulp.dest(pathSrc.css))
    .pipe(browserSync.stream());
});

// server
gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: pathSrc.root
    }
  });
  // watch
  gulp.watch(pathSrc.scss + "/**/*", gulp.series("sass"))
  gulp.watch(pathSrc.root + "/**/*",).on("change", browserSync.reload);
});

// gulp start
gulp.task("default", gulp.series("clean", "sass", "server"));
// gulp.task("default", gulp.series("clean", gulp.parallel("sass:root", "sass:contents"), "server"));
```

---

### test 버전(현재) rollup 변환 / rollup.config.js
```js
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import path from 'path';
import del from 'del';

const rootPath = path.resolve(__dirname);
const charset = '@charset "utf-8";\n\n';
const pathSrc = {
  root: "./html/guide",
  scss: "./resources/scss",
  css: "./build/css",
};

// 배포 폴더 삭제
del.sync([pathSrc.css]);

export default {
  input: pathSrc.scss + '/styles.scss',
  output: {
    file: pathSrc.css + '/styles.css',
    format: 'es',
  },
  plugins: [
    postcss({
      extract: true,
      minimize: false,
      sourceMap: true,
      plugins: [
        require('autoprefixer')
      ],
      extensions: ['.scss'],
      process: (css) => charset + css,
      use: ['sass'],
    }),
    serve({
      open: true,
      contentBase: pathSrc.root,
      port: 3000,
    }),
    livereload({
      watch: pathSrc.css,
    }),
  ],
};

// 명령어
{
  "scripts": {
    "start": "rollup -c --watch"
  }
}

```

---

### test 버전(현재) vite 변환 / vite.config.js
```js
// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${path.resolve(__dirname, './resources/scss')}/variables.scss";`, // SCSS 변수 파일 임포트
      },
    },
  },
});

```

---

### test 버전(현재) webpack 변환 / webpack.config.js
```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './resources/scss/styles.scss', // 진입점으로 사용할 SCSS 파일 경로
  output: {
    path: path.resolve(__dirname, 'build/css'), // 출력 경로
    filename: 'bundle.js', // 출력 파일 이름 (여기서는 필요 없지만 Webpack의 요구사항)
  },
  module: {
    rules: [
      {
        test: /\.scss$/, // .scss 확장자를 가진 모든 파일에 대해
        use: [
          'style-loader', // HTML에 <style> 태그로 스타일을 삽입
          'css-loader', // CSS를 CommonJS로 변환
          'sass-loader' // SCSS를 CSS로 컴파일
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'html/guide'), // 개발 서버의 기본 경로
    watchContentBase: true, // 파일 변경 감지 여부
    port: 8080, // 개발 서버 포트 번호
    open: true, // 브라우저 자동 열기
  },
};
```

---

### focus-trap 사이트 예 / rollup.config.js
```js
/* eslint-disable no-console */
/* eslint-env node */

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import sourceMaps from 'rollup-plugin-sourcemaps';

const pkg = require('./package.json');

// REQUIRED: process.env.BUILD_ENV: "esm" | "cjs" | "umd"

const terserOptions = {
  output: {
    comments(node, comment) {
      const text = comment.value;
      const type = comment.type;
      if (type === 'comment2') {
        // multiline comment: keep if it starts with a bang or contains
        //  some common preservation keywords
        return (
          text.indexOf('!') === 0 || /@preserve|@license|@cc_on/i.test(text)
        );
      }
    },
  },
};

const commonPlugins = [
  resolve(),
  commonjs({
    include: 'node_modules/**',
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  sourceMaps(),
];

const banner = `/*!
* ${pkg.name} ${pkg.version}
* @license ${pkg.license}, ${pkg.homepage.replace(
  '#readme',
  '/blob/master/LICENSE'
)}
*/`;

const commonConfig = {
  input: './src/index.js',
};

const commonOutput = {
  preserveModules: false, // NOTE: must be false to 'roll-up' all code into one file
  sourcemap: true,
  banner,
};

// TODO: would be nice for it to be 'tabbable' (for 'tabbable.js', 'tabbable.min.js',
//  etc.), but that would risk breaking consumer assumptions about the file name, and
//  would require another new major release
const libName = 'index';

const cjs = [
  // NOTE: non-minified does NOT bundle dependencies
  {
    ...commonConfig,
    external: [],
    output: {
      file: `dist/${libName}.js`,
      format: 'cjs',
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: `dist/${libName}.min.js`,
      format: 'cjs',
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser(terserOptions)],
  },
];

const esm = [
  // NOTE: non-minified does NOT bundle dependencies
  {
    ...commonConfig,
    external: [],
    output: {
      file: `dist/${libName}.esm.js`,
      format: 'esm',
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: `dist/${libName}.esm.min.js`,
      format: 'esm',
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser(terserOptions)],
  },
];

const umd = [
  // NOTE: non-minified does NOT bundle dependencies
  {
    ...commonConfig,
    external: [],
    output: {
      file: `dist/${libName}.umd.js`,
      format: 'umd',
      noConflict: true,
      name: 'tabbable',
      ...commonOutput,
      globals: {},
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: `dist/${libName}.umd.min.js`,
      format: 'umd',
      noConflict: true,
      name: 'tabbable',
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser(terserOptions)],
  },
];

let config = {};
console.log(process.env.BUILD_ENV);
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs;
    break;
  case 'esm':
    config = esm;
    break;
  case 'umd':
    config = umd;
    break;
  default:
    throw Error(
      'You must define process.env.BUILD_ENV before building with rollup. Check rollup.config.js for valid options.'
    );
}

export default config;
```