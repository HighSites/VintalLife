import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";
import rename from "gulp-rename";

let otfToTtf = () => {
	if (fs.existsSync($.path.fonts.styleFile)) {
		console.warn('\x1b[33m%s\x1b[0m', `otf fonts won't be converted to ttf format as ${$.path.fonts.styleFile} already exists`);
		return $.gulp.src($.path.from);
	}
	return $.gulp.src($.path.fonts.src + "/*.otf")
		.pipe($.plumber($.conf.plumber))
		.pipe(fonter({ formats: ['ttf'] }))
		// // the line below fixing catalog naming mistake in linux OS
		// .pipe(rename(function (file) {
		// 	// console.log("DIRNAME: " + file.dirname);
		// 	// console.log("BASENAME: " + file.basename);
		// 	file.dirname += $.path.fonts.src_cat;
		// 	file.basename = file.basename.slice($.path.fonts.src_cat.length - 1);
		// 	// console.log("DIRNAME: " + file.dirname);
		// 	// console.log("BASENAME: " + file.basename);
		// }))
		.pipe($.gulp.dest($.path.fonts.src));
}

let ttfToWoff = () => {
	if (fs.existsSync($.path.fonts.styleFile)) {
		console.warn('\x1b[33m%s\x1b[0m', `ttf fonts won't be converted to woff & woff2 format as ${$.path.fonts.styleFile} already exists`);
		return $.gulp.src($.path.from);
	}
	return $.gulp.src($.path.fonts.src + "/*.ttf")
		.pipe($.plumber($.conf.plumber))
		.pipe(fonter({ formats: ['woff'] }))
		// 	// the line below fixing catalog naming mistake in linux OS
		// 	// .pipe(rename(function (file) {
		// 	// 	console.log("DIRNAME: " + file.dirname);
		// 	// 	console.log("BASENAME: " + file.basename);
		// 	// 	// file.dirname += $.path.fonts.src_cat;
		// 	// 	// file.basename = file.basename.slice($.path.fonts.src_cat.length - 1);
		// 	// 	console.log("DIRNAME: " + file.dirname);
		// 	// 	console.log("BASENAME: " + file.basename);
		// 	// }))
		.pipe($.gulp.dest($.path.fonts.dest))
		.pipe($.gulp.src($.path.fonts.src + "/*.ttf"))
		.pipe(ttf2woff2())
		.pipe($.gulp.dest($.path.fonts.dest))
}

let fontsStyle = () => {
	if (fs.existsSync($.path.fonts.styleFile)) {
		console.warn('\x1b[33m%s\x1b[0m', `fonts declarations won't be written to sass file as it (${$.path.fonts.styleFile}) already exists`);
		return $.gulp.src($.path.from);
	}
	fs.readdir($.path.fonts.dest, function (err, fontsFiles) {
		if (!fontsFiles) return $.gulp.src($.path.from);
		fs.writeFile($.path.fonts.styleFile, '', (cb));
		let prevFont;
		fontsFiles.forEach(font => {
			let fontFileName = font.split('.')[0];
			if (prevFont == fontFileName)
				return;
			prevFont = fontFileName;
			let fontName = fontFileName.split('-')[0];
			let fontWeight = fontFileName.split('-')[1] || 'none';
			let varSupport = '', varTabs = '\t';
			if (fontWeight.toLowerCase().includes('var')) {
				varSupport = '@supports (font-variation-settings: "wdth" 115)\n';
				varTabs += '\t';
			}
			let weightCompilance = {
				'thin': 100,
				'extralight': 200,
				'ultralight': 200,
				'light': 300,
				'lite': 300,
				'medium': 500,
				'semibold': 600,
				'bold': 700,
				'extrabold': 800,
				'heavy': 800,
				'black': 900
			};
			fontWeight = weightCompilance[fontWeight.toLowerCase()] || 400;
			if (varSupport.length > 1) {
				console.warn('\x1b[41m%s\x1b[0m\x1b[33m%s\x1b[0m', 'Attention!!!\nVariable font was detected!\t\tPlease go to the fonts style file and correct it! The information below might help you:\n', `fonts style file path: ${$.path.fonts.styleFile},\n* correcting variable fonts weight: go to the sorce (or font file) and look for the min & max values then write them at weight property like diapason(exp: weight: 100 900)\n* non-variable dublicats need to be transfered nder support-not media: just take the support rule from variable font declaration and insert 'not' before the rule `)
			}
			if ($.path.css_preproc[$.path.css_preproc.length - 3] == 'a')
				fs.appendFile($.path.fonts.styleFile, `${varSupport}${varTabs.replace('\t', '')}@font-face\n${varTabs}font-family: ${fontName}\n${varTabs}font-display: swap\n${varTabs}src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff")\n${varTabs}font-weight: ${fontWeight}\n${varTabs}font-style: normal\r\n`, cb);
			else fs.appendFile($.path.fonts.styleFile, `${varSupport}${varTabs.replace('\t', '')}@font-face{\n${varTabs}font-family: ${fontName};\n${varTabs}font-display: swap;\n${varTabs}src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n${varTabs}font-weight: ${fontWeight};\n${varTabs}font-style: normal;\n}\r\n`, cb);

		})
	})
	return $.gulp.src($.path.from);
	function cb() { };
}

import gulp from 'gulp';

export default gulp.series(otfToTtf, ttfToWoff, fontsStyle);

