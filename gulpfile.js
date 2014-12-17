/*jslint node: true */
'use strict';

//gulp &  plugins
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var gutil = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');


var paths = {
  main    : 'app/app.js',
  main_dist : 'build/app.js',
  app_sources : [ 'app/**/*.js'],
  dist_sources : ['app/**' , 'node_modules/**'],
  gulp_dependency : ['build/del', 'build/gulp','build/gulp-**'],
  tests   : 'test/**/*.js',
  build   : 'build/',
  dist    : 'dist/',
  name    : 'sillycat-proxy',
  version : '1.0'
};

gulp.task('clean', function(cb) {
  del([paths.dist, paths.build], cb);
});

gulp.task('build', ['clean'], function() {
    return gulp.src(paths.dist_sources)
      .pipe(gulp.dest(paths.build));
});

gulp.task('clean:build', ['build'], function(cb) {
  del(paths.gulp_dependency, cb);
});

gulp.task('dist', ['clean:build'] ,function () {
  return gulp.src(paths.build + '**')
    .pipe(tar(paths.name + '-' + paths.version + '.tar'))
    .pipe(gzip())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('serve:dist', ['clean:build'], function(){
  return nodemon({
    script: paths.main_dist
  });
});

// lint all of our js source files
gulp.task('jshint', function (){
  return gulp.src(paths.app_sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// run mocha tests
gulp.task('test', function (){
  return gulp.src(paths.tests, {read: false})
  .pipe(mocha({reporter: 'list'}))
  .on('error', gutil.log);
});

//run app using nodemon
gulp.task('serve', [], function(){
  return nodemon({
    script: paths.main,
    watch   : paths.app_sources
  });
});
