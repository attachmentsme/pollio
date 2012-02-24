Much Win with Node.js for Client-Side Unit Testing
=================================================

I've never sat down to do browser-based unit-testing and left the experience with a huge smile on my face.

As a result, I've found that I often drift away from being a responsible tester of my JavaScript code. Why is this?

* Selector-based testing, using tools like Selenium and QUnit, is fragile.
* Due to this selector-centric paradigm, I feel these tools encourage you to test the wrong things. Point-and-click integration testing is flimsy at best.
* Given that these technologies are steeped in the browser, making them part of a CI pipeline is a pain.

I've recently made a major change in my approach to client-side unit-testing. I'm not going back.

Unit Testing With Node.js
-------------------------

In the course of making several Node.js libraries, I gradually developed an approach to asynchronous unit-testing that I love.

I pulled this into a micro-framework that I drop into all my JS projects:

[Node-Micro-Test](https://github.com/bcoe/node-micro-test)

__Here's what a test looks like:__

```javascript
var equal = require('assert').equal;

exports.tests = {
	'true should be equal to true': function(finished, prefix) {
		setTimeout(function() {
			equal(true, true, prefix + " that's weird, true should really be equal to true.");
			finished();
		}, 2000);
	}
};
```

* __finished__ this closure is called once, upon the terminal condition of your unit test. It moves the suite forward to the next test.
* __prefix__ a string containing the name of the current test being executed. This can be used to print out contextual information when your assertions fail.

Client-Side Testing
-------------------

This approach was working great for testing my Node.js libraries, but I was falling into my old routine of letting my client-side JavaScript become neglected.

Finally, fed up, I made up my mind:

* I'm going to primarily test models and controllers. Testing UI is, for the most part, too brittle.
* I'm going to use Node.js to test my client-side JavaScript.
  * making tests easier to automate.
  * allowing me to develop in a paradigm outside of the browser.
* I'm going to rely heavily on mocks rather than integration tests.

I've been using this approach for my past few projects, and let me tell you, I have a huge smile on my face.

Mocking
-------

Rather than running a headless browser, I mock out the browser dependencies.

Here are some examples:

__Mocking jQuery.ajax__

```javascript
global.jQuery = {
	response: {foo: 'bar'},
	ajax: function(params) {
		setTimeout(function() {
			params.success(jQuery.response);
		}, 10);
	}
};
```

__Mocking the Chrome Extension API__

```javascript
global.chrome = {
	extension: {
		handleMessage: function(request, sender, callback) {
			equal(sender.tab.id, 'background', prefix + ' tabId was not correct');
			equal(request.body.foo, 'bar', prefix + ' foo was not equal to bar');
			finished();
		}
	}
}
```

JavaScript is such an easy language to mock in. This approach is much cleaner than having a massive set of dependencies, i.e., the whole freaking web-browser.

Examples
--------

* [pollio](https://github.com/attachmentsme/pollio) is a lightweight polling library built using the methodologies discussed in this post, check it out.
* you can find the tests for pollio in the directory __/test__.
* Note that, although pollio is ultimately used in our Chrome extension, the tests are run via Node.js.