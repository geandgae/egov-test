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

```

---

### 번들링
```bash

* test 버전(현재)의 번들링은 gulp


* Rollup
- Google material: rollup(https://rollupjs.org/)
- 프랑스: rollup
- shopify polaris: rollup

* Gulp
- 영국정부 GOV UK: gulp

* Bundler
- 미국정부 USWDS: Bundler v2.2.0(https://bundler.io/)


```

---

### focus-trap rollup.config.js
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