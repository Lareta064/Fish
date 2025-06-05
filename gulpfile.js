const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const pug = require("gulp-pug");
const del = require("del");
const browserSync = require("browser-sync").create();
const webp = require("gulp-webp");
const ttf2woff2 = require("gulp-ttf2woff2");

// Очистка
gulp.task("clean:build", () => del("./build"));

// PUG
gulp.task("pug", function () {
    console.log("🔁 PUG пересобирается...");
    return gulp.src("./src/pug/pages/**/*.pug")
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest("./build/"));
});

// SCSS
gulp.task("scss", function () {
    console.log("🎨 SCSS пересобирается...");
    return gulp.src("./src/scss/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("./build/css"));
});

// IMG: webp + копия
gulp.task("img:webp", () => 
    gulp.src("./src/img/**/*.{jpg,jpeg,png}")
        .pipe(webp())
        .pipe(gulp.dest("./build/img"))
);

gulp.task("img:copy", () =>
    gulp.src(["./src/img/**/*", "!./src/img/**/*.{jpg,jpeg,png}"])
        .pipe(gulp.dest("./build/img"))
);

gulp.task("img", gulp.parallel("img:webp", "img:copy"));

// Fonts
gulp.task("fonts:ttf2woff2", () =>
    gulp.src("./src/fonts/**/*.ttf")
        .pipe(ttf2woff2())
        .pipe(gulp.dest("./build/fonts"))
);

gulp.task("fonts:copy", () =>
    gulp.src("./src/fonts/**/*.{woff,woff2}")
        .pipe(gulp.dest("./build/fonts"))
);

gulp.task("fonts", gulp.parallel("fonts:ttf2woff2", "fonts:copy"));

// Копирование прочих файлов
gulp.task("copy:js", () => 
    gulp.src("./src/js/**/*.*")
        .pipe(gulp.dest("./build/js"))
);

gulp.task("copy:libs", () => 
    gulp.src("./src/libs/**/*.*")
        .pipe(gulp.dest("./build/libs"))
);
gulp.task("copy:video", () => 
    gulp.src("./src/video/**/*.*")
        .pipe(gulp.dest("./build/video"))
);
// Server
gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        notify: false,
        open: true
    });
});
gulp.task("pug:ui", function () {
    console.log("🔁 PUG UI пересобирается...");
    return gulp.src("./src/pug/ui/**/*.pug")
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest("./build/ui"));
});
// Watch
gulp.task("watch", function () {
    console.log("👁 Watch запущен...");

    gulp.watch("./src/pug/**/*.pug", gulp.series("pug", done => {
        console.log("📄 PUG изменён");
        browserSync.reload(); done();
    }));

    gulp.watch("./src/scss/**/*.scss", gulp.series("scss", done => {
        console.log("🎨 SCSS изменён");
        browserSync.reload(); done();
    }));

    gulp.watch("./src/js/**/*.js", gulp.series("copy:js", done => {
        console.log("📜 JS изменён");
        browserSync.reload(); done();
    }));

    gulp.watch("./src/libs/**/*.*", gulp.series("copy:libs", done => {
        console.log("📚 LIBS изменены");
        browserSync.reload(); done();
    }));

    gulp.watch("./src/img/**/*.{jpg,jpeg,png}", gulp.series("img:webp", done => {
        console.log("📸 JPG/PNG → WEBP");
        browserSync.reload(); done();
    }));

    gulp.watch(["./src/img/**/*", "!./src/img/**/*.{jpg,jpeg,png}"], gulp.series("img:copy", done => {
        console.log("📎 SVG и др. скопированы");
        browserSync.reload(); done();
    }));

    gulp.watch("./src/fonts/**/*.ttf", gulp.series("fonts:ttf2woff2", done => {
        console.log("🔤 TTF → WOFF2");
        browserSync.reload(); done();
    }));

    gulp.watch("./src/fonts/**/*.{woff,woff2}", gulp.series("fonts:copy", done => {
        console.log("📁 WOFF/WOFF2 скопированы");
        browserSync.reload(); done();
    }));
    gulp.watch("./src/pug/ui/**/*.pug", gulp.series("pug:ui", function (done) {
    console.log("📄 UI PUG изменён");
    browserSync.reload();
    done();
}));
});

// Default
gulp.task("default", gulp.series(
    "clean:build",
    gulp.parallel("pug","pug:ui", "scss", "copy:js", "copy:libs", "img", "fonts", "copy:video"),
    gulp.parallel("server", "watch")
));
