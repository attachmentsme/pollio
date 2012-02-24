function PollIO(ajax, params) {
	if (typeof(ajax) == 'object') {
		params = ajax;
		ajax = undefined;
	}
	
	params = params || {};
	this.ajax = ajax || jQuery.ajax;
	this.eventLoopInterval = params.eventLoopInterval || 1000; // Defaults to a second of granularity.
	
	this.pollLookup = {};
	this.pollIdentifier = 0;

	if (params.autoStart !== false) {
		this.start();
	}
}

PollIO.prototype.schedule = function(params) {
	var defaults = {
		onResults: function(results, stopPolling) {},
		onFailure: function() {},
		frequency: 1000,
		max: -1,
		pollCount: 0,
		iterationCount: 0,
		identifier: ++ this.pollIdentifier,
		ajax: null
	};	
	
	params.ajaxParams = this._getAjaxParams(params, defaults);
	this._update(params, defaults);
	
	params.mod = this._calculateMod(params.frequency);
	
	if (this.pollLookup[params.identifier]) return;
	this.pollLookup[params.identifier] = params;
};

PollIO.prototype._calculateMod = function(frequency) {
	if (frequency < this.eventLoopInterval) return 1;
	return parseInt( frequency / this.eventLoopInterval );
};

PollIO.prototype._update = function(a, b) {
	for (var key in b) {
		if (b.hasOwnProperty(key)) {
			if (!a[key]) {
				a[key] = b[key];
			}
		}
	}
};

PollIO.prototype._getAjaxParams = function(a, b) {
	var ajaxParams = {};
	for (var key in a) {
		if (a.hasOwnProperty(key)) {
			if (b[key] === undefined) {
				ajaxParams[key] = a[key];
				delete a[key];
			}
		}
	}
	return ajaxParams;
};

PollIO.prototype.start = function() {
	var _this = this;
	
	this.intervalId = setInterval(function() {
		_this._handlePolling();
	}, this.eventLoopInterval);
};

PollIO.prototype.stop = function() {
	clearInterval(this.intervalId);
};

PollIO.prototype._handlePolling = function() {
	var _this = this;
	for (var key in this.pollLookup) {
		if (this.pollLookup.hasOwnProperty(key)) {
			var pollObject = this.pollLookup[key];
			if ( ( (pollObject.iterationCount++) % pollObject.mod ) == 0 ) {
				if (!this._stopIterating(pollObject)) {
					this._handleAjaxCall(pollObject);
				}
			}
		}
	}
};

PollIO.prototype._stopIterating = function(pollObject) {
	if (pollObject.pollCount++ == pollObject.max) {
		delete this.pollLookup[pollObject.identifier];
		pollObject.onFailure();
		return true;
	}
	return false;
};

PollIO.prototype._handleAjaxCall = function(pollObject) {
	var _this = this;
	pollObject.ajaxParams.success = function(results) {
		pollObject.onResults(results, function() {
			delete _this.pollLookup[pollObject.identifier];
		});
	};
	if (pollObject.ajax) {
		pollObject.ajax(pollObject.ajaxParams);
	} else {
		this.ajax(pollObject.ajaxParams);
	}
};

// Specifically for our unit tests which are written in Node.js.
if (typeof(exports) !== 'undefined') {
	exports.PollIO = PollIO;
}