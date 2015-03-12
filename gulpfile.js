var gulp = require('gulp');

var gulpUtil = require('gulp-util');
var jshint = require('gulp-jshint');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

gulp.task('lint-js', function () {
  return gulp.
  src(['**/*.js', '!node_modules/**', '!static/dist/js/**', '!www/js/app.js']).
  pipe(jshint()).
  pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('build-client-js', function () {
  var fileBrowserification = transform(function (filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src('static/src/js/main.js').
  pipe(fileBrowserification).
  pipe(process.env.NODE_ENV === 'production' ? uglify() : gulpUtil.noop()).
  pipe(gulp.dest('static/dist/js/'));
});

gulp.task('build-css', function () {
  return gulp.src('static/src/scss/*').pipe(gulp.dest('static/dist/css'));
});

gulp.task('optimize-img', function () {
  return gulp.src('static/src/img/*').
  pipe(imagemin()).
  pipe(gulp.dest('static/dist/img'));
});

gulp.task('lint', ['lint-js']);
gulp.task('build', ['build-client-js', 'build-css', 'optimize-img']);
gulp.task('default', ['lint', 'build']);