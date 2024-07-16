"use strict";

// plug-in
const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const browserSync = require("browser-sync").create();
const flatten = require('gulp-flatten');
const sourcemaps = require('gulp-sourcemaps');

// path
const pathSrc = {
  root: "./",
  scss: "./resources/scss/**/*.scss",
  css: "./resources/css/output",
  dist: "./dist/css",
  js: "./resources/js/component/*.js"
};
const pathDist = {
  css: "./dist/css",
  js: "./dist/js",
};


// clean
gulp.task("clean", function () {
  return import("del").then((del) => {
    return del.deleteAsync([pathSrc.css, pathDist.css, pathDist.js]);
  });
});

// sass
gulp.task("sass", function() {
  return gulp.src(pathSrc.scss)
    .pipe(sourcemaps.init()) // sourcemaps
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write('./')) // sourcemaps
    .pipe(flatten()) // flatten
    .pipe(gulp.dest(pathSrc.css)) // 가이드경로
    .pipe(gulp.dest(pathSrc.dist)) // 배포경로
    .pipe(browserSync.stream());
});

// JavaScript
gulp.task("scripts", function () {
  return gulp.src(pathSrc.js)
    .pipe(gulp.dest(pathDist.js))
    .pipe(browserSync.stream());
});

// server
gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: pathSrc.root
    },
    startPath: './html/guide/index.html'
  });
  // watch
  gulp.watch(pathSrc.scss, gulp.series("sass"))
  gulp.watch(pathSrc.js, gulp.series("scripts"))
  gulp.watch(pathSrc.root + "/**/*").on("change", browserSync.reload);
});

// gulp start
gulp.task("default", gulp.series("clean", "sass", "scripts", "server"));