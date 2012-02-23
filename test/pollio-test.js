var equal = require('assert').equal,
	puts = require('util').puts,
	PollIO = require('../lib/pollio').PollIO;

global.jQuery = {
	ajax: function() {}
};

exports.tests = {
	'should allow the first parameter to be either params or the ajax function': function(finished, prefix) {
		var pollio = new PollIO({pollLoopFrequency: 3000});
		equal(3000, pollio.pollLoopFrequency, prefix + ' true was not false.');
		equal('function', typeof(pollio.ajax), prefix + ' ajax function was not defined.');
		pollio = new PollIO(function() { return 'foo' }, {pollLoopFrequency: 2000});
		equal(2000, pollio.pollLoopFrequency, prefix + ' true was not false.');
		equal('foo', pollio.ajax(), prefix + ' ajax function was not defined.');
		finished();
	}
};