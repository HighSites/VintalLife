import notify from 'gulp-notify';

const isProd = process.argv.includes("--production") ||
               process.argv.includes("--prod") ||
               process.argv.includes("-p");
const isPreProd = process.argv.includes("--preproduction") ||
               process.argv.includes("--preprod") ||
               process.argv.includes("--pp");
const isDev = !(isProd || isPreProd);

const noAvif = process.argv.includes("--no-avif") ||
               process.argv.includes("--na") ||
               false;
const isAvif = !noAvif;

const isPlay = process.argv.includes("--play") ||
               process.argv.includes("--pl");


export default {
    isProd: isProd,
    isDev: isDev,
    noAvif: noAvif,
    isAvif: isAvif,
    isPlay: isPlay,
    isPreProd: isPreProd,

    htmlmin: {
        collapseWhitespace: true,
        removeAttributeQuotes: true, 
        removeComments: true,
        removeEmptyAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        minifyURLs: true
    },

    plumber: {
        errorHandler: notify.onError(error => ({
            message: error.message
        }))
    },

    versionNumber: {
        'value': '%DT%',
        'append': {
            'key': '_v',
            'cover': 0,
            'to': [
                'css', 
                'js'
            ]
        },
        'output': {
            'file': 'gulp/version.json'
        }
    },

    webpack: {
        mode: isDev ? "development" : "production",
        output: {
            filename: 'app.min.js'
        }
    },

    imagemin: {
        verbose: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
    },

    webp: {
        quality: 75
    },

    avif: {
        quality: 60
    },

    autoprefixer: {
        grid: true,
        cascade: true
    },

    svgSprite: {
        mode: {
            symbol: {
                sprite: '../svgSprite.svg',
                layout: 'diagonal',
                example: isDev,
                // inline: 'true'
            }
        }
    },

		nunjucksRender: {
			path: ['project/dev']
		}
}