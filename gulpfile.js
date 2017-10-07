var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var template = require("gulp-template");
var del = require('del');

var fs = require("fs");
var codepoints = require('./codepoints');

var icons = fs.readdirSync("src/icons");

icons = icons.map(function (icon) {
  return icon.replace(/\.\w+$/, '');
});

// 定义字体名称、CSS Class名称
var fontName = 'netstar-icons';
// 定义CSS Class名称
var className = 'nsicon';

function checkUniqueCodePoints(codepoints) {
  var cp2fileName = {};
  var cp;

  for (var fileName in codepoints) {
    cp = codepoints[fileName];

    if (cp2fileName[cp] !== undefined) {
      throw new Error('Duplicate codepoint "0x' + cp.toString(16) + '".');
    }

    cp2fileName[cp] = fileName;
  }
}

gulp.task('iconfont', function () {
  checkUniqueCodePoints(codepoints);

  return gulp.src('src/icons/*.svg')
    .pipe(iconfontCss({
      cssClass: className,
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
      fontHeight: 1001,
      // prependUnicode: false
    }))
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('example', function () {
  return gulp.src('src/example/index.html')
    .pipe(template({
      icons: icons,
      cssClass: className
    }))
    .pipe(gulp.dest("./dist/example"));
});

gulp.task('clean', function () {
  return del(['./dist']);
});

gulp.task('default', gulp.series('clean', 'iconfont', 'example'));