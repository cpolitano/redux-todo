'use strict';

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');

gulp.task('clean', function() {
  return del(['dist','public/js/app.js']);
});

gulp.task('babel', function () {
  return gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('babel');
});