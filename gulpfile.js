/// <reference path="typings/tsd.d.ts" />

var gulp = require('gulp');
var install = require('gulp-install');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var del = require('del');
var runSequence = require('run-sequence');

var paths = {
	js: {
		src: 'src/**/*.ts',
		out: 'out'
	}
};

gulp.task('clean', function (done) {
	del(['out']).then(function (paths) {
		done();
	}).catch(function (error) {
		done(error);
	});
});

gulp.task('install', function () {
	return gulp.src(['package.json', 'tsd.json']).pipe(install());
});

gulp.task('js', function () {
	return gulp.src(paths.js.src).pipe(ts({
		target: 'es6'
	})).js.pipe(babel({
		comments: false
	})).pipe(gulp.dest('out'));
});

gulp.task('build', function (done) {
	runSequence(['clean', 'install'], 'js', done);
});