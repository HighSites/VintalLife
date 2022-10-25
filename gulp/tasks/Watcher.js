import for_html from './Nunjucks.js';
import for_styles from './Sass.js';
import for_stylesInline from './CriticalCss.js';
import for_scripts from './Js.js';
import forImages from './Imgs.js';
import svgSprite from './svgSprite.js';

let watcher = () => {
    $.gulp.watch($.path.html.watch, for_html);
    $.gulp.watch($.path.style.watch, for_styles);
    $.gulp.watch($.path.styleInline.watch, $.gulp.series(for_stylesInline, for_html));
    $.gulp.watch($.path.script.watch, for_scripts);
    $.gulp.watch($.path.imgs.watch, forImages);
    $.gulp.watch($.path.svgicons.watch, svgSprite);
}

export default watcher;