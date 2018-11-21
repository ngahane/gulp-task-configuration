var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    imageMin = require('gulp-imagemin'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    zip = require('gulp-zip'),
    merge = require('merge-stream'),
    plumber = require('gulp-plumber'),
    useref = require('gulp-useref'),
    filter = require('gulp-filter');

// Browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "app/"
        }
    });
});

// Sass
gulp.task('compass', function() {
   gulp.src('**.scss')
        .pipe(plumber())
        .pipe(compass())
        .pipe(gulp.dest('app/assets/styles')); 
});

// Start serve
gulp.task('serve', ['browser-sync'], function(){
    gulp.watch('assets/styles/*.css', function (file) {
        if (file.type === "changed") {
            reload(file.path);
        }
    });
    gulp.watch("**/*.*", ['reload']);
})

// Reload all Browsers
gulp.task('reload', function () {
    browserSync.reload();
});

// Clearn
gulp.task('clean', function(){
    return gulp.src('dist', {read : false})
                .pipe(clean());
})

// Image min
gulp.task('minImages', ['clean'], function(){
    return gulp.src('app/assets/images/*.*')
                .pipe(imageMin())
                .pipe(gulp.dest('dist/assets/images/'));
})


// Copy other files
gulp.task('copyFiles', ['minImages'], function(){
    var views = gulp.src('app/views/**/*.*')
                    .pipe(gulp.dest('dist/views/'));

    var favicon = gulp.src('app/assets/favicon/**/*.*')
                        .pipe(gulp.dest('dist/assets/favicon/'));

    var fonts = gulp.src('app/assets/font/**/*.*')
                    .pipe(gulp.dest('dist/assets/font/'));

    return merge(views, favicon, fonts);
})


// Build
gulp.task('build', ['copyFiles'], function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('**/*.js', uglify()))
        .pipe(gulpif('**/*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
})


// Run
gulp.task('run', ['build'], function(){
    browserSync({
        server: {
            baseDir: "dist/"
        }
    });
}) 

// Pack
gulp.task('pack', ['build'], function(){
    return gulp.src('dist/**/*.*')
                .pipe(zip('dist.zip'))
                .pipe(gulp.dest('.'));
}) 