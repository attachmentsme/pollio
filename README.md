PollIO
======

PollIO wraps _jQuery.ajax_ and provides a convenient abstraction for polling an endpoint.

Why it's cool:

* For efficiency, PollIO schedules the polling AJAX requests into a single event loop.
* PollIO lets you override its _ajax_ method. For instance, we use an _ajax_ method with OAuth punched onto it.
* PollIO handles the annoyance of expiring polling requests for you, after a set number of intervals.
* PollIO is a demonstration of our TDD approach to client-side JavaScript development, using our Node.js micro testing framework.

Usage
-----

Instantiating the PollIO object
-------------------------------


```javascript
/**
 @param {function} ajax function (optional, defaults to jQuery.ajax).
 @param {options} the options object.
*/
var pollio = new PollIO({
	pollLoopFrequency: 1000 // Defaults to 1 second.
});
```

* _pollLoopFrequency_ how often does the event loop iterate (you can't schedule an AJAX request to poll more frequently than this.)

Scheduling a Polling Request
----------------------------

```javascript
pollio.schedule({
	identifier: 'myPollingCall',
	pollFrequency: 200, // ms.
	maxPolls: 3,
	onFailure: function() {
		// We did not hit a success scenario, take some default action.
	},
	onResults: function(results, stopPolling) {
		if (results.success) {
			stopPolling();
		}
	},
	// ajax parameters.
	url: 'example.com',
	type: 'get',
});
```

* _identifier_ an optional identifier for this polling request. Only one polling request for a given identifier can be scheduled at a time.
* _pollFrequency_ how frequently should this request be made? Granularity can't be less than _pollLoopFrequency_.
* _maxPolls_ the maximum number of times that this request should be attempted.
* _onFailure_ this callback is executed if maxPolls is exceeded.
* _onResults_ the results from a successful _ajax_ request. Call _stopPolling()_ to remove this request from the scheduler.

Ajax Parameters
---------------

Any additional parameters provided are used to construct the polling _ajax_ request. see (http://api.jquery.com/jQuery.ajax/)

Testing
-------

PollIO uses node.js for unit testing. run _node test/index.js_ to execute the test suite.

Copyright
---------

Copyright (c) 2011 Attachments.me. See LICENSE.txt for further details.