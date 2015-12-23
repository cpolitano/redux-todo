'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('clean', function() {
  return del(['dist','public/js/app.js']);
});

gulp.task('babel', function () {
  return gulp.src('src/*.js')
    .pipe(babel())
    // .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify', ['babel'], function() {
	return browserify('dist/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('browserify');
});
