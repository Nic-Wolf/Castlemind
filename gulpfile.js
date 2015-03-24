var gulp       = require('gulp');
var gutil      = require('gulp-util');
var source     = require('vinyl-source-stream');
var watchify   = require('watchify');
var browserify = require('browserify');

var bundler = watchify(browserify('./public/app/index.js', watchify.args));

function bundle() {
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/assets/javascripts'));
}

bundler.on('update', bundle);
bundler.on('log', gutil.log);

gulp.task('js', bundle);
gulp.task('default', ['js']);

