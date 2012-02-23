function PollIO(params) {
	var params = params || {};
}

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.PollIO = PollIO;
}