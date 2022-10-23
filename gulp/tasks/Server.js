const server = () => {
    $.browserSync.init({
        server: {
            baseDir: $.path.root
        },
    });
}

export default server;