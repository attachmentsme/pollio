Much Win, with Node.js for Client-Side Unit Testing
=================================================

I've never sat down to do client-side unit-testing testing of JavaScript and left the experience with a giant smile on my face.

As a result, I've found that I often drift away from being a responsible tester of my JavaScript code. Why is this?

* Selector-based testing, using tools like Selenium or QUnit, is fragile.
* Due to this paradigm, I feel these tools encourage you to test the wrong things. I find I often fall into the trap of making point-and-click integration tests of my UI.
* Given that these technologies are steeped in the browser, making them part of a CI environment sucks.

I've recently made a major change in my approach to client-side unit-testing, and I'm not going back.

Unit Testing With Node.js
-------------------------

In the course of making several Node.js libraries, I gradually developed an approach to asynchronous unit-testing that I love.

I built this into a micro-framework that I drop into all my JS projects.

__Here's what a test looks like:__

```javascript
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
}
```

* __finished__ this closure is called once, upon the terminal condition of your unit test, and moves the suite forward.
* __prefix__ a string containing the name of the current test being executed. This lets the assertion print out a cleaner error message.