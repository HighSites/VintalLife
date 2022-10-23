import svgSprite from 'gulp-svg-sprite';

let sprite = () => {
    return $.gulp.src($.path.svgicons.src)
    .pipe($.plumber($.conf.plumber))
    .pipe(svgSprite($.conf.svgSprite))
    .pipe($.gulp.dest($.path.svgicons.dest))
    .pipe($.browserSync.stream())
}

export default sprite;