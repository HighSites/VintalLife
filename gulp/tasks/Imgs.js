import newer from "gulp-newer";
import webp from "gulp-webp";
import avif from "gulp-avif";
import imagemin from "gulp-imagemin";

let convert = () => {
	if ($.conf.noAvif) {
		let message = "'NoAvif' mode is on, please, make sure to have the right code in project/global/system/scripts/WebpAvifSupport.js";
		$.Alert(message);
	}

	let fileDir = (file) => {
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~LOOOK A FILE!!!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		console.log('file.relative', file.relative);
		console.log('file.path', file.path);
		console.log('file.base', file.base);
		file.path = file.path.replace(`\\${$.path.imgs.dest_cat}`, '');
		file.base = file.base.replace(`\\${$.path.imgs.dest_cat}`, '');
		console.log('file.relative', file.relative);
		console.log('file.path', file.path);
		console.log('file.base', file.base);
		return $.path.imgs.dest;
	}

	let alreadyTransfered = `{none}`;
	let nowTransfering = `{png,jpg,jpeg}`;
	let transfer;

	if ($.conf.isProd || $.conf.isPreProd) {
		transfer = $.gulp.src($.path.imgs.src.map(path => path + `*.${nowTransfering}`).concat($.path.imgs.src.map(path => '!' + path + `*.${alreadyTransfered}`)))
			.pipe($.plumber($.conf.plumber))
			.pipe(newer($.path.imgs.dest))
			.pipe(avif($.conf.avif))
			.pipe($.gulp.dest(file => fileDir(file)));
		transfer = $.gulp.src($.path.imgs.src.map(path => path + `*.*`).concat($.path.imgs.src.map(path => '!' + path + `*.${alreadyTransfered}`)))
			.pipe($.plumber($.conf.plumber))
			.pipe(newer($.path.imgs.dest))
			.pipe(webp($.conf.webp))
			.pipe($.gulp.dest(file => fileDir(file)));
	}
	nowTransfering = nowTransfering.slice(0, -1) + `,gif,svg}`;
	transfer = $.gulp.src($.path.imgs.src.map(path => path + `*.${nowTransfering}`).concat($.path.imgs.src.map(path => '!' + path + `*.${alreadyTransfered}`)))
	.pipe($.plumber($.conf.plumber))
	.pipe(newer($.path.imgs.dest))
	.pipe($.gulpif($.conf.isProd, imagemin($.conf.imagemin)))
	.pipe($.gulp.dest(file => fileDir(file)));
	alreadyTransfered = alreadyTransfered.slice(0, -1) + ',' + nowTransfering.slice(1, -1) + '}';
	
	transfer = $.gulp.src($.path.imgs.src.map(path => path + `*.*`).concat($.path.imgs.src.map(path => '!' + path + `*.${alreadyTransfered}`)))
		.pipe($.plumber($.conf.plumber))
		.pipe(newer($.path.imgs.dest))
		.pipe($.gulp.dest(file => fileDir(file)));

	$.browserSync.reload();
	return transfer;
}

export default convert;