
let project_folder = "dist";
let source_folder = "src";

let path={
    build:{
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src:{
        html: [ source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/main.js",
        img: source_folder + "/img/*.{jpg,png,gif,svg}",
        fonts: source_folder + "/fonts/*.{woff,woff2}",
    },
    watch:{
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/*.js",
        img: source_folder + "/img/*.{jpg,png,gif,svg}",
    },
    clean: "./" +  project_folder + "/"
}

let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    autoprefixer = require("gulp-autoprefixer"),
    groupmedia = require("gulp-group-css-media-queries"),
    scss = require("gulp-sass"),
    cleancss = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin");

    function browserSync(params) {
        browsersync.init({
            server:{
                baseDir: "./" + project_folder + "/"
            },
            port: 3000,
            notify: false
        })
    }

    function html() {
        return src(path.src.html)
            .pipe(fileinclude())
            .pipe(dest(path.build.html))
            .pipe(browsersync.stream())
    }

    function css() {
        return src(path.src.css)
            .pipe(
                scss({
                    outputStyle: "expanded"
                })
            )
            .pipe (groupmedia())
            .pipe(
            autoprefixer({
                    overrideBrowserslist: ["last 5 versions"],
                    cascad: true
                })
            )
            .pipe(dest(path.build.css))
            .pipe (cleancss())
            .pipe(
                rename({
                    extname: ".min.css"
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream())
    }

    function js() {
        return src(path.src.js)
            .pipe(fileinclude())
            .pipe(dest(path.build.js))
            .pipe(browsersync.stream())
    }

    function img() {
        return src(path.src.img)
            .pipe(
                imagemin ({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    interlaaced: true,
                    opyimizationLevel: 3
                })
            )
            .pipe(dest(path.build.img))
            .pipe(browsersync.stream())
    }

    function fonts() {
        return src(path.src.fonts)
            .pipe(dest(path.build.fonts))
    }

    function watchFiles(perams) {
        gulp.watch([path.watch.html], html);
        gulp.watch([path.watch.css], css);
        gulp.watch([path.watch.js], js);
        gulp.watch([path.watch.img], img);
    }

    function clean(perams) {
        return del(path.clean);
    }

    let build = gulp.series(clean, gulp.parallel(js,css,html,fonts,img));
    let watch = gulp.parallel(build, watchFiles, browserSync);

    exports.img = img;
    exports.fonts = fonts;
    exports.js = js;
    exports.css = css;
    exports.html = html;
    exports.build = build;
    exports.watch = watch;
    exports.default = watch;