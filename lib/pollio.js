function PollIO(params) {
	this.ajax = params.ajax || jQuery.ajax;
	this.pollLoopFrequency = params.pollLoopFrequency || 1000;
}

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.PollIO = PollIO;
}