var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

gulp.task('default', function() {

    // wrap scripts in amd-start/end 
    var scripts = [
        "./src/amd-start.js",

        "./src/cache.js",
        "./src/ajax.js",
        "./src/dispatch.js",
        "./src/router.js",
        "./src/utils.js",

        "./src/amd-end.js"
    ];

    gulp.src(scripts)
        .pipe(concat('loaded.js'))
        .pipe(gulp.dest('./dist'));

    gulp.src(scripts)
        .pipe(concat('loaded.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {

    watch(["./src/*.js"], function (event) {
        gulp.start('default');
    });
});
