import gulp from 'gulp';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import gulpMode from 'gulp-mode';

const mode = gulpMode();
const paths = {
  scripts: {
    src: 'js/**/*.js',
    dest: 'dist/js/'
  },
  styles: {
    src: 'css/**/*.css',
    dest: 'dist/css/'
  }
};

function minifyJs() {
  return gulp.src(paths.scripts.src)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(mode.production(uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(paths.scripts.dest));
}

function minifyCss() {
  return gulp.src(paths.styles.src)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(mode.production(cleanCSS()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest));
}

function watchFiles() {
  gulp.watch(paths.scripts.src, minifyJs);
  gulp.watch(paths.styles.src, minifyCss);
}

const build = gulp.series(gulp.parallel(minifyJs, minifyCss));
const watch = gulp.series(gulp.parallel(minifyJs, minifyCss), watchFiles);

export { watch };
export default build;
