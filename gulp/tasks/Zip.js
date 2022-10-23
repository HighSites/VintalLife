import del from "del";
import gulpZip from "gulp-zip";

const zip = () => {
    del("${$.path.fin}/${$.path.rootName}.zip");
    return $.gulp.src($.path.root + "/**/*.*")
    .pipe($.plumber($.conf.plumber))
    .pipe(gulpZip($.path.rootName + '.zip'))
    .pipe($.gulp.dest($.path.fin));
}

export default zip;