var gulp = require('gulp');
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var watchify = require('watchify'); // Watchify for source changes
var source = require('vinyl-source-stream'); // Vinyl stream support
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

// Configuration for Gulp
var config = {
  js: {
    src: './public/scripts/index.js',
    watch: './public/scripts/*.js',
    outputDir: './public/build',
    outputFile: 'app.js',
  },
  isWatching: true
};

gulp.task('build', function() {
  var bundler = browserify({
    // Required watchify args
    cache: {},
    packageCache: {},
    // Browserify Options
    entries: [config.js.src]
  }).transform(babelify, { presets: ['react'] }); // Babel tranforms

  var bundle = function(e) {
    if (e) {
      gutil.log("Update", e);
    }
    return bundler
      .bundle()
      .on('error', function(e) {
        gutil.log(e);
      })
      .pipe(source(config.js.outputFile))
      .pipe(gulp.dest(config.js.outputDir));
  };

  if (config.isWatching) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);
  }

  return bundle();
});

gulp.task('css', function() {
  return gulp.src('public/css/*.css')
    .pipe(minifyCSS())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(config.js.outputDir))
});

gulp.task('dependencies-css', function() {
  return gulp.src('node_modules/openlayers/dist/ol.css')
    .pipe(gulp.dest(config.js.outputDir))
});