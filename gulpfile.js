//================================================
//  define variables
//  load gulp plugins ↓
//================================================
var gulp         = require('gulp'),
    del          = require('del'),
    autoprefixer = require('autoprefixer'),
    browserSync  = require('browser-sync').create(),
    plugins      = require('gulp-load-plugins')({
      pattern      : ['gulp-*', 'gulp.*'],
      replaceString: /\bgulp[\-.]/,
      lazy         : false
    });

//================================================
//  dev tasks ↓
//================================================
function notify(message) {
  browserSync.notify('<span style="color:#d33;">' + message + '</span>', 15000);
}

function onError(error) {
  console.log(error.message);
  notify(error.message);
  this.emit('end');
}

// Start browserSync server
function runServer() {
  return browserSync.init({
    server: './',
    port: 8080,
    ui: false,
    notify: {
      styles: {
        padding: '10px',
        right: 'auto',
        left: 0,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 0,
        border: '1px solid #ddd',
        fontSize: '16px',
        color: '#333'
      }
    }
  });
}

// compile sass files
function compileSass() {
  return gulp.src('scss/main.scss')
    .pipe(plugins.plumber({
      errorHandler: onError
    }))

    // globbing SCSS @import
    .pipe(plugins.sassBulkImport())

    .pipe(plugins.sass({
      sourceMapContents: true,
      sourceMapEmbed: true
    }))
    .pipe(gulp.dest('css/'))

    // Reloading the stream
    .pipe(browserSync.reload({stream: true}));
}

function validateHTML() {
  return gulp.src('*.html')
    .pipe(plugins.w3cjs())
    .pipe(plugins.w3cjs.reporter());
}

// watch files for changes
function watch() {
  runServer();
  gulp.watch('scss/**/*.scss', {usePolling: true}, compileSass); // usePolling to prevent compile time increase
}

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series(compileSass, watch));
gulp.task('validate-html', validateHTML);
