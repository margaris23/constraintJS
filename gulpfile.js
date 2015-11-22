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
var plato = require('gulp-plato');
var eslint = require('gulp-eslint');

gulp.task('default', ['test'], function() {
    // Default task
});
 
gulp.task('eslint', function () {
    return gulp.src(['model.js', 'test/test.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('pre-test', ['eslint'], function () {
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

gulp.task('plato', function () {
    return gulp.src(['model.js', 'test/*.js'])
        .pipe(plato('report', {
            jshint: {
                options: {
                    strict: true
                }
            },
            complexity: {
                trycatch: true
            }
        }));
});
