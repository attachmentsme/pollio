Much Win, with Node.js for Client-Side Unit Testing
=================================================

I've never sat down to do browser-based unit-testing and left the experience with a huge smile on my face.

As a result, I've found that I often drift away from being a responsible tester of my JavaScript code. Why is this?

* Selector-based testing, using tools like Selenium and QUnit, is fragile.
* Due to this selector-centric paradigm, I feel these tools encourage you to test the wrong things. I think point-and-click integration tests are a dangerous trap to fall in to.
* Given that these technologies are steeped in the browser, making them part of a CI process sucks.

I've recently made a major change in my approach to client-side unit-testing, and I'm not going back.

Unit Testing With Node.js
-------------------------

In the course of making several Node.js libraries, I gradually developed an approach to asynchronous unit-testing that I love.

I built this into a micro-framework that I drop into all my JS projects:

[Node-Micro-Test](https://github.com/bcoe/node-micro-test)

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

Client-Side Testing
-------------------

This approach was working great for testing my Node.js libraries, but I was falling into my old routine of letting my client-side JavaScript become neglected.

Finally, I came to these decisions:

* I'm going to primarily test models and controllers. Testing UI is, for the most part, too brittle.
* I'm going to use Node.js to test my client-side JavaScript.
  * making tests easier to automate.
  * allowing me to develop in a paradigm outside of the browser.
* I'm going to rely heavily on mocks rather than integration tests.

I've been using this approach for my past few projects, and let me tell you, I do have a huge smile on my face.