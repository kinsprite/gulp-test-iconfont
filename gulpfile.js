const gulp = require('gulp');
const rename = require('gulp-rename');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const bs = require('browser-sync').create();
const del = require('del');

/**
 * Font settings
 */
const fontName = 'netstar-icons'; // set name of your symbol font
const className = 'nsicon'; // set class name in your CSS
const template = 'fontawesome-style'; // or 'foundation-style'
const skethcFileName = 'symbol-font-14px.sketch'; // or 'symbol-font-16px.sketch'

/**
 * Recommended to get consistent builds when watching files
 * See https://github.com/nfroidure/gulp-iconfont
 */
const timestamp = Math.round(Date.now() / 1000);

gulp.task('iconfont', () =>
  gulp.src('src/icons/*.svg')
    .pipe(iconfont({
      fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      normalize: true,
      fontHeight: 1001,
      prependUnicode: true,
      timestamp,
      log: () => {} // suppress unnecessary logging
    }))
    .on('glyphs', (glyphs) => {
      const options = {
        className,
        fontName,
        fontPath: '../fonts/', // set path to font (from your CSS file if relative)
        glyphs: glyphs.map(mapGlyphs)
      };

      gulp.src(`templates/${template}.css`)
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: fontName }))
        .pipe(gulp.dest('dist/css/')); // set path to export your CSS

      // if you don't need sample.html, remove next 4 lines
      gulp.src(`templates/${template}.html`)
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename: 'sample' }))
        .pipe(gulp.dest('dist/')); // set path to export your sample HTML
    })
    .pipe(gulp.dest('dist/fonts/')) // set path to export your fonts
);

gulp.task('watch', () => {
  bs.init({
    files: 'dist/sample.html',
    server: 'dist/',
    startPath: '/sample.html',
    middleware: cacheControl
  });

  gulp.watch('src/icons/*.svg', gulp.series('iconfont', (cb) => {
    bs.reload();
    cb();
  }));
})

gulp.task('clean', function () {
  return del(['./dist']);
});

gulp.task('default', gulp.series('clean', 'iconfont'));

/**
 * This is needed for mapping glyphs and codepoints.
 */
function mapGlyphs (glyph) {
  if (glyph.name.indexOf(' ') !== -1) {
    throw new Error(`Invalid glyph file name: "${glyph.name}", blank space isn't allowed!`);
  }

  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) };
}

/**
 * This keeps browser from caching fonts for your testing environment
 */
function cacheControl (req, res, next) {
  res.setHeader('Cache-control', 'no-store');
  next();
}
