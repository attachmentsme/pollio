var puts = require('util').puts,
	fs = require('fs'),
	tests = [];

function run(callback, test) {
	callback(
		function() {
			
			if (arguments.callee.executed) return;
			arguments.callee.executed = true;
			
			puts(test + ' \033[32m[Success]\033[m');
			if (tests.length == 0) {
				puts(' \033[32mAll tests finished.\033[m');
				process.exit();
			} else {
				tests.shift()();
			}
		},
		test + ': '
	);
}

function addTests(testsObject) {
	for (var test in testsObject) {
		(function(func, name) {
			tests.push(function() {
				run(func, name);
			});
		})(testsObject[test], test);
	}
}

fs.readdir('./test', function(err, files) {
	for (var i = 0, file; (file = files[i]) != null; i++) {
		addTests( require('../test/' + file.match(/^(.*)\.js$/)[1]).tests );
	}
	tests.shift()();
});