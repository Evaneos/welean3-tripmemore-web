'use strict';
var config = require('./config/front.js'),
    version = require('./config/app.js').version;

var gulp = require('gulp'),
    fs = require('fs'),
    eventStream = require('event-stream'),
    $ = require('gulp-load-plugins')();

// Style =======================================================================
gulp.task('less', function() {
    return gulp.src(config.less.paths.src + '/*.less')
        .pipe(
            $.less(config.less.options)
            .on('error', function(err) {
                console.error('Less compilation error: ' + err.message);
                this.emit('end');
            })
        )
        .pipe($.rename({
            suffix: '-' + version
        }))
        .pipe(gulp.dest(config.less.paths.dist));
});

gulp.task('less:clean', function(){
    var matching = [config.less.paths.dist + '/*.css'];
    console.info('Clean css: delete files matching' + matching.join(', '));
    return gulp.src(matching, { read: false })
        .pipe($.rimraf());
});

// Javascript ==================================================================
gulp.task('js:lint', function(){
    var hasNotifyGlobalError= false;

    return gulp.src( [ config.js.paths.src + '/*.js'] )
        .pipe( $.jshint(config.js.linter) )
        .pipe( $.jshint.reporter(function (errors) {
            var currentFile = '';
            for(var k in errors) {
                var error = errors[k];
                if(currentFile!==error.file) {
                    if(!hasNotifyGlobalError) {
                        console.error('!!! Javascript linter error');
                        hasNotifyGlobalError=true;
                    }
                    console.error('Error in ' + error.file);
                    currentFile=error.file;
                }
                console.error('> Line ' + error.error.line + ' col ' + error.error.character + ': ' + error.error.raw);
            }
        }));
});

gulp.task('js', ['js:lint', 'js:vendor'], function() {
    return gulp.src(config.js.paths.src + '/*.js')
        .pipe( 
            $.browserify(config.js.browserify)
                .on('error', function(err) {
                    console.error('Browserify failed');
                    console.error('js browserify error: ' + err.message);
                    this.emit('end');
                })
        )
        .pipe( 
            $.uglify(config.js.uglify)
                .on('error', function(err) {
                    console.error('Uglify failed');
                    console.error('js uglify error:' + err.message);
                    this.emit('end');
                })
        )
        .pipe($.rename({
            suffix: '-' + version
        }))
        .pipe(gulp.dest(config.js.paths.dist));
});

gulp.task('js:vendor', function() {
    var src = config.js.vendor || {};
    var me = this;
    return eventStream.merge.apply(eventStream, Object.keys(src).map(function(dest) {
        console.info('Javascript concat : destination file ' + dest);

        var files = this[dest];
        for(var k in files) {
            if(!fs.existsSync(files[k])) {
                console.error('Javascript concatenation failed: file "'+files[k] + '" is missing');
                me.emit('end');
            }
            else {
                console.info('> File ' + files[k]);
            }
        }

        return gulp.src(files)
            .pipe($.concat(config.js.paths.dist + '/' + dest))
            .pipe($.uglify(config.js.uglify)
            .on('error', function() {
                console.error('Js Uglify error while uglifying js');
                this.emit('end');
            }))
            .pipe($.rename({
                suffix: '-' + version
            }))
            .pipe(gulp.dest( '.'  ));

    }, src));
});

gulp.task('js:clean', function(){
    var matching = [config.js.paths.dist + '/**/*.js'];
    console.info('Clean js: delete files matching' + matching.join(', '));
    return gulp.src(matching, { read: false })
        .pipe($.rimraf());
});

// Fonts ======================================================================
gulp.task('fonts', function() {
    return gulp.src(config.fonts.paths.src + '/**/*')
        .pipe(gulp.dest(config.fonts.paths.dist));
});

gulp.task('fonts:clean', function() {
    var matching = [config.fonts.paths.dist + '/**/*'];
    console.info('Clean fonts: delete files matching' + matching.join(', '));
    return gulp.src(matching, { read: false })
        .pipe($.rimraf());
});

// Static ======================================================================
gulp.task('static', function() {
    return gulp.src(config.static.paths.src + '/**/*')
        .pipe(gulp.dest(config.static.paths.dist));
});

// Watcher ======================================================================
gulp.task('watch', function() {
    gulp.watch(config.less.paths.src + '/**/*.less', ['less']);
    gulp.watch(config.js.paths.src + '/**/*.js', ['js']);
    gulp.watch(config.static.paths.src + '/**/*', ['static']);
    gulp.watch(config.fonts.paths.src + '/**/*', ['fonts']);
});

// Main tasks ==================================================================

gulp.task('default', ['less', 'js', 'fonts', 'static']);
gulp.task('clean', ['less:clean', 'js:clean', 'fonts:clean']);
