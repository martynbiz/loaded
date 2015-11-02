
if(typeof loaded === "undefined") loaded = {};

/**
 * Collection of helper utils
 */
loaded.utils = (function() {

	/**
	 * Extend an object e.g. utils.extend(default, options)
	 */
	var _extend = function() {

		var new_options = {};
		for(var i=0; i<arguments.length; i++) {
			for(var name in arguments[i]) { new_options[name] = arguments[i][name] }
		}
		return new_options;
 	}

	return {
		extend: _extend,
	};
})();
