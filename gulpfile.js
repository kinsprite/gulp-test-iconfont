var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var clean = require("gulp-clean");
var taskListing = require("gulp-task-listing");
var template = require("gulp-template");

var fs = require("fs");
var codepoints = require('./codepoints');

var icons = fs.readdirSync("src/icons");


icons = icons.map(function(icon){
   return icon.replace(/\.\w+$/, '');
});

var fontName = 'iconfont';

gulp.task('iconfont', function(){
  gulp.src('src/icons/*.svg')
    .pipe(iconfontCss({
      fontName: fontName,
      fixedCodepoints: codepoints,
      path: 'src/templates/_icons.css',
      targetPath: '../../dist/css/_icons.css',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      // prependUnicode: false
     }))
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('example', function(){
  gulp.src('src/example/index.html')
     .pipe(template({icons: icons}))
     .pipe(gulp.dest("./dist/example"));
});

gulp.task('clean', function(){
   gulp.src("./dist", {read: false}).pipe(clean());
});

gulp.task('help', taskListing);

gulp.task('default', ['clean', 'iconfont', 'example']);
