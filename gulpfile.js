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
};

// clean
gulp.task("clean", function () {
  return import("del").then((del) => {
    return del.deleteAsync([pathSrc.css]);
  });
});

// sass
gulp.task("sass", function() {
  return gulp.src(pathSrc.scss)
    .pipe(sourcemaps.init()) // sourcemaps
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write('./')) // sourcemaps
    .pipe(flatten()) // flatten
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
  gulp.watch(pathSrc.scss, gulp.series("sass"))
  gulp.watch(pathSrc.root + "/**/*").on("change", browserSync.reload);
});

// gulp start
gulp.task("default", gulp.series("clean", "sass", "server"));