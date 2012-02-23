function PollIO(ajax, params) {
	if (typeof(ajax) == 'object') {
		params = ajax;
		ajax = jQuery.ajax;
	}
	params = params || {};
	this.ajax = ajax;
	this.pollLoopFrequency = params.pollLoopFrequency || 1000;
}

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.PollIO = PollIO;
}