var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    importer = require('node-sass-globbing'),
    del = require('del'),
    stripCssComments = require('gulp-strip-css-comments'),
    uglify = require('gulp-uglify'),
    print = require('gulp-print'),
    babel = require('gulp-babel');
    // babel-preset-es2015

var CacheBuster = require('gulp-cachebust'),
    cachebust = new CacheBuster(),
    sass_config = {
      importer: importer,
      includePaths: [
        'node_modules/breakpoint-sass/stylesheets/',
        'node_modules/singularitygs/stylesheets/'
      ]
    };

gulp.task('clean', function(cb) {
  del([
    './public/dist'
  ], cb);
});

gulp.task('watch', function() {
    return gulp.watch(['./public/index.html','./public/components/**/*.html', './public/assets/css/*.*css', './public/components/**/*.js', './public/services/*.js', './public/routes.js'], ['build']);
});

gulp.task('build', ['clean', 'build-css', 'build-js'],
function() {
   return gulp.src('index.html')
      .pipe(cachebust.references())
      .pipe(gulp.dest('dist'));
});

gulp.task('build-css', function() {
  gulp.src([
      'public/assets/css/**/*.*css',
      'public/assets/css/*.*css',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass(sass_config))
    .pipe(cachebust.resources())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(stripCssComments({preserve: false}))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('build-js', function() {
   return gulp.src([
        'public/app.js',
        'public/routes.js',
        'public/Services/*.js',
        'public/components/**/*.js',
        'public/assets/js/filters/*.js',
      ])
      .pipe(sourcemaps.init())
      .pipe(print())
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat('bundle.js'))
      // .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/dist/js'));
});
