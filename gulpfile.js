/// <reference path="typings/tsd.d.ts" />

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;

var paths = {
	babel: {
		src: 'out/ts',
		out: 'out/babel'
	}
};

var isWin = /^win/.test(process.platform);

function getNpmBin(done) {
	exec('npm bin', function(error, stdout, stderr) { 
		npmBin = stdout.toString().trim();
		done();
	});
}

var npmBin;

function run(program, args, done, global, file) {
	if (npmBin === undefined) {
		getNpmBin(function () {
			run(program, args, done, global, file);
		});
	} else {
		if (!global) {
			program = npmBin + '/' + program;
		}
		var process;
		if (isWin) {
			args.unshift(program);
			args.unshift('/c');
			process = spawn('cmd', args);
		} else {
			process = spawn(program, args);
		}
		var total = '';
		process.stdout.on('data', function (data) {
			var out = data.toString();
			if (file) {
				total += out;
			} else {
				console.log(out.substring(0, out.length - 1));
			}
		});
		process.stderr.on('data', function (data) {
			var out = data.toString();
			console.error(out.substring(0, out.length - 1));
		});
		process.on('exit', function (code) {
			if (file) {
				fs.writeFileSync(file, total);
			}
			done(code);
		});
	}
}

gulp.task('npm', function (done) {
	run('npm', ['update'], done, true);
});

gulp.task('tsd', function (done) {
	run('tsd', ['install'], done);
});

gulp.task('update', function (done) {
	runSequence('npm', 'tsd', done);
});

gulp.task('ts', function (done) {
	run('tsc', [], done);
});

gulp.task('babel', function (done) {
	run('babel', ['--modules', 'common', paths.babel.src, '--out-dir', paths.babel.out], done);
});

gulp.task('clean', function (done) {
	del(['out'], done);
});

gulp.task('js', function (done) {
	runSequence('ts', 'babel', done);
});

gulp.task('build', function (done) {
	runSequence('clean', 'update', 'js', done);
});

gulp.task('build-debug', function (done) {
	runSequence('clean', 'js', done);
});

gulp.task('run', function (done) {
	run('npm', ['start'], done, true);
});

gulp.task('test-debug', function (done) {
	runSequence('build-debug', 'run', done);
});

gulp.task('test', function (done) {
	runSequence('build', 'run', done);
});

gulp.task('debug', ['test-debug']);
gulp.task('d', ['debug']);
gulp.task('default', ['test']);