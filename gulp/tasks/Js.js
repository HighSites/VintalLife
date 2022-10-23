import webpack from "webpack-stream";

let compile = () => {
    return $.gulp.src($.path.script.src, {sourcemaps: $.conf.isDev})
    .pipe($.plumber($.conf.plumber))
    .pipe(webpack($.conf.webpack))
    .pipe($.gulp.dest($.path.script.dest, {sourcemaps: $.conf.isDev}))
    .pipe($.browserSync.stream())
}

export default compile;