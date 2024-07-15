"use strict";

// plug-in
const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const browserSync = require("browser-sync").create();
const header = require('gulp-header');
const flatten = require('gulp-flatten');

// path
const charset = '@charset "utf-8";\n\n';
const pathSrc = {
  root: "./",
  scss: "./resources/scss/**/*.scss",
  css: "./build/css/output",
};

// 배포 폴더 삭제
gulp.task("clean", function () {
  return import("del").then((del) => {
    return del.deleteAsync([pathSrc.css]);
  });
});

// sass
gulp.task("sass", function() {
  return gulp.src(pathSrc.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(header(charset))
    .pipe(flatten())
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