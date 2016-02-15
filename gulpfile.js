var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');

gulp.task('js', function() {
    return gulp.src([
        './source/angular/angular.min.js',
        './source/angular/angular-animate.min.js',
        './source/angular/angular-translate.min.js',
        './source/app.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    return gulp.src('./source/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('compress', ['js'], function() {
    return gulp.src('./dist/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('./source/**/*.js', ['js', 'compress']);
    gulp.watch('./source/**/*.html', ['html']);
});

gulp.task('build', ['js', 'html', 'compress']);
