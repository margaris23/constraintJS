/*global json */
/*
 * gulp.js
 * Copyright (C) 2015 margaris <margaris@localhost>
 *
 * Distributed under terms of the MIT license.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');


gulp.task('default', function() {
	  // place code for your default task here
});

gulp.task('pre-test', function () {
  return gulp.src(['model.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});