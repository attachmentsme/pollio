var equal = require('assert').equal,
	puts = require('util').puts,
	PollIO = require('../lib/pollio').PollIO;

global.jQuery = {
	response: {foo: 'bar'},
	ajax: function(params) {
		setTimeout(function() {
			params.success(jQuery.response);
		}, 10);
	}
};

exports.tests = {
	'should allow the first parameter to be either params or the ajax function': function(finished, prefix) {
		var pollio = new PollIO({eventLoopInterval: 3000});
		equal(3000, pollio.eventLoopInterval, prefix + ' true was not false.');
		equal('function', typeof(pollio.ajax), prefix + ' ajax function was not defined.');
		pollio = new PollIO(function() { return 'foo' }, {eventLoopInterval: 2000});
		equal(2000, pollio.eventLoopInterval, prefix + ' true was not false.');
		equal('foo', pollio.ajax(), prefix + ' ajax function was not defined.');
		finished();
	},
	
	'_calculateMod returns appropriate values for the intended poll interview': function(finished, prefix) {
		var pollio = new PollIO({eventLoopInterval: 1000});
		equal(pollio._calculateMod(100), 1, prefix + ' value less than eventLoopInterval should return 1.');
		equal(pollio._calculateMod(2000), 2, prefix + ' mod should be 2.');
		equal(pollio._calculateMod(3000), 3, prefix + ' mod should be 3.');
		finished();
	},
	
	'scheduleing an event with just a onResults condition populates currentPolls with appropriate object': function(finished, prefix) {
		var pollio = new PollIO({eventLoopInterval: 1000, autoStart: false});
		pollio.schedule({
			onResults: function(response) {return response.value;}
		});
		
		equal(32, pollio.pollLookup[1].onResults({value: 32}), prefix + ' did not properly serialize function.');
		equal(-1, pollio.pollLookup[1].max, prefix + ' incorrect duration.');
		equal(1, pollio.pollLookup[1].mod, prefix + ' incorrect mod.');
		finished();
	},
	
	'if the same poll is registered with the same identifier twice original is left': function(finished, prefix) {
		var pollio = new PollIO({autoStart: false});
		
		pollio.schedule({
			identifier: 'foobar',
			frequency: 2000,
			max: 3
		});
		
		pollio.schedule({
			identifier: 'foobar',
			frequency: 5000,
			max: 5
		});
		
		equal(3, pollio.pollLookup['foobar'].max, prefix + ' incorrect duration.');
		equal(2, pollio.pollLookup['foobar'].mod, prefix + ' incorrect mod.');
		finished();
	},
	
	'ajaxParams populated with all keys not in the defaults object': function(finished, prefix) {
		var pollio = new PollIO({autoStart: false});
		
		pollio.schedule({
			identifier: 'foobar',
			frequency: 2000,
			max: 3,
			url: 'example.com',
			type: 'get'
		});

		equal('foobar', pollio.pollLookup['foobar'].identifier, prefix + ' ajaxParams not populated.');		
		equal('get', pollio.pollLookup['foobar'].ajaxParams['type'], prefix + ' ajaxParams not populated.');
		equal('example.com', pollio.pollLookup['foobar'].ajaxParams['url'], prefix + ' ajaxParams not populated.');
		finished();
	},
	
	'onResults is executed by event loop': function(finished, prefix) {
		var pollio = new PollIO();
		
		pollio.schedule({
			identifier: 'foobar',
			frequency: 1000,
			max: 3,
			url: 'example.com',
			type: 'get',
			onResults: function(results, stopPolling) {
				stopPolling();
				equal(results.foo, 'bar', prefix + ' foo was not equal to bar.');
				finished();
			}
		});
	},
	
	'calling stopPolling in onResults removes the poll from the polling map': function(finished, prefix) {
		var pollio = new PollIO();
		
		pollio.schedule({
			identifier: 'foobar',
			frequency: 1000,
			url: 'example.com',
			type: 'get',
			onResults: function(results, stopPolling) {
				stopPolling();
				equal(pollio.pollLookup['foobar'], null, prefix + ' foobar poll not removed from map.');
				finished();
			}
		});
	},

	'polling stops after the appropriate number of polls': function(finished, prefix) {
		var pollio = new PollIO({
			eventLoopInterval: 100
		});
		
		var iterations = 0;

		pollio.schedule({
			identifier: 'foobar',
			frequency: 200,
			max: 3,
			url: 'example.com',
			type: 'get',
			onFailure: function() {
				equal(pollio.pollLookup['foobar'], null, prefix + ' foobar poll not removed from map.');
				equal(iterations, 3, prefix + ' did not terminate after the appropriate number of iterations.');
				finished();
			},
			onResults: function(results, stopPolling) {
				iterations++;
			}
		});
	}
};