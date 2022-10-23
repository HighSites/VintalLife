import del from 'del';

let clear = () => {
    if ($.conf.isDev)
        return del([$.path.root + "/*", "!" + $.path.imgs.dest, '!' + $.path.fonts.dest]);
    return del([$.path.root, $.path.fonts.styleFile]);
}

export default clear;