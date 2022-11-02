import webpHtml from "gulp-webp-html-nosvg";
import avifWebpHTML from "gulp-avif-webp-html";
import size from "gulp-size";
import htmlmin from "gulp-htmlmin";
import versionNumber from "gulp-version-number";
import nunjucksRender from "gulp-nunjucks-render";
import flatten from 'gulp-flatten';

const njk = () => {
  return $.gulp.src($.path.html.src)
    .pipe($.plumber($.conf.plumber))
    .pipe(nunjucksRender($.conf.nunjucksRender))
    .pipe($.replace('@imgsGlob', $.path.imgs.dest_cat))
    .pipe($.replace('@imgs', function handleReplace(match){return $.path.imgs.dest_cat + '\\' + this.file.stem;}))
    
    .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, versionNumber($.conf.versionNumber)))
    .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, ($.gulpif($.conf.isAvif, avifWebpHTML()))))
    .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, ($.gulpif($.conf.noAvif, webpHtml()))))
    
    .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, size({ title: "Html [pre]size = " })))
    .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, htmlmin($.conf.htmlmin)))
    .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, size({ title: "Html [post]size = " })))
    
    .pipe(flatten())
    .pipe($.gulp.dest($.path.html.dest))
    .pipe($.browserSync.stream())
};

export default njk;