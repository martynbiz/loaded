var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrap-amd'),
    watch = require('gulp-watch');

gulp.task('default', function() {

    // wrap scripts in amd-start/end
    var scripts = [
        "./src/cache.js",
        "./src/http.js",
        "./src/dispatch.js",
        "./src/router.js",
        "./src/utils.js",
    ];

    gulp.src(scripts)
        .pipe(concat('loaded.js'))
        .pipe(gulp.dest('./dist'));

    gulp.src(scripts)
        .pipe(concat('loaded.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));

    gulp.src(scripts)
        .pipe(concat('loaded-amd.js'))
        .pipe(wrap({
            deps: ['handlebars', 'jquery'],          // dependency array
            params: ['Handlebars', '$'],        // params for callback
            exports: 'loaded',         // variable to return
            // moduleRoot: 'templates/', // include a module name in the define() call, relative to moduleRoot
            // modulePrefix: 'rocks/'  // optional, prefix of the module name. It depends on existance of `moduleRoot`
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {

    watch(["./src/*.js"], function (event) {
        gulp.start('default');
    });
});
