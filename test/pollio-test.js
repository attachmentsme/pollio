var equal = require('assert').equal,
	puts = require('util').puts,
	PollIO = require('../lib/pollio').PollIO;
	
exports.tests = {
	'should be an application': function(finished, prefix) {
		var pollio = new PollIO();
		equal(true, false, prefix + ' true was not false.');
	}
};