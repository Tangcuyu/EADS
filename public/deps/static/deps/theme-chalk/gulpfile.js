'use strict';

const { series, src, dest } = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const base64  = require('gulp-base64')

function compile() {
  return src('./less/*.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(dest('../../dist'));
}

function copyImg() {
    return src('./less/images/**')
        .pipe(dest('../../dist/images'));
  // return src('./src/fonts/**')
  //   .pipe(cssmin())
  //   .pipe(dest('./lib/fonts'));
}

exports.build = series(compile,copyImg);
