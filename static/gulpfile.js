var gulp = require('gulp'),
    karma = require('karma').server,
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    wiredep = require('wiredep').stream,
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    copy = require('gulp-copy'),
    inject = require('gulp-inject');

var source = ['app.js', 'src/**/module.js', 'src/**/*.js', '!src/**/*.spec.js'],
    forWatch = source.concat(['index.html', 'src/**/*.html']);

gulp.task('minify', function () {
    gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('jshint', function () {
    gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

gulp.task('bower', function () {
    gulp.src('index.html')
        .pipe(wiredep({read:false}))
        .pipe(gulp.dest(''));
});

gulp.task('inject', function () {
    gulp.src('index.html')
        .pipe(inject(gulp.src(source, {read:false})))
        .pipe(gulp.dest(''));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
    }, done);
});

gulp.task('browser-sync', ['test'], function () {
   browserSync.init(forWatch, {
      server: {
         baseDir: ''
      }
   });
});

gulp.task('useref', function () {
    var assets = useref.assets();
    
    return gulp.src('index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    return gulp.src('src/**/*.html')
        .pipe(copy('dist'));
});
