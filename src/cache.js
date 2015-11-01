
if(typeof martynbiz === "undefined") martynbiz = {};

/**
 * An instance for storing and retrieving data
 * External to ajax encase I wanna use it throughout the app
 */
martynbiz.cache = (function() {

	/**
	 * @var object The cache
	 */
	var _cache = {};

	/**
	 * Get a cached item
	 */
	var _get = function(key) {
 		return _cache[key];
 	};

	/**
	 * Set a cache item
	 * @param mixed key The key to set in the cache
	 * @param mixed value The cached item
	 */
	var _insert = function(url, data) {
		_cache[url] = data;
	};

	/**
	 * Clean (empty) the cache
	 */
	var _clean = function() {
 	  _cache = {};
 	  return _cache
	};

	return {
		get: _get,
		insert: _insert,
		clean: _clean
	};
})();
