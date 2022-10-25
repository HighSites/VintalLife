import size from 'gulp-size';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
let sass = gulpSass(dartSass);
import avifCss from 'gulp-avif-css';
import webpCss from 'gulp-webpcss';
import flatten from 'gulp-flatten';


let Sass = () => {
    return $.gulp.src([$.path.style.src, '!' + $.path.style.srcNot], { sourcemaps: $.conf.isDev })
        .pipe($.plumber($.conf.plumber))
        .pipe(sass({ includePaths: [$.path.system] }))
        .pipe($.replace("@imgs/", "../" + $.path.imgs.dest_cat))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulpif($.conf.isAvif, avifCss())))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulpif($.conf.noAvif, webpCss())))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, autoprefixer($.conf.autoprefixer)))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, groupCssMediaQueries()))
        .pipe(flatten())
        .pipe($.gulp.dest($.path.style.dest, { sourcemaps: $.conf.isDev }))

        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, size({ title: "Css [pre]size = " })))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulp.dest($.path.style.dest, { sourcemaps: $.conf.isDev })))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, csso()))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, size({ title: "Css [post]size = " })))
        .pipe(rename({ suffix: ".min" }))
        .pipe($.gulp.dest($.path.style.dest, { sourcemaps: $.conf.isDev }))
        .pipe($.browserSync.stream())
};

export default Sass;