
if(typeof loaded === "undefined") loaded = {};

/**
 * An instance for storing and retrieving data
 * External to ajax encase I wanna use it throughout the app
 */
loaded.cache = (function() {

	/**
	 * @var object The cache
	 */
	var _cache = {};

	/**
	 * Get a cached item
	 * @param string key The key to set in the cache
	 * @return mixed
	 */
	var _get = function(key) {
 		return _cache[key];
 	};

	/**
	 * Set a cache item
	 * @param string key The key to set in the cache
	 * @param mixed value The cached item
	 */
	var _set = function(url, data) {
		_cache[url] = data;
	};

	/**
	 * Clean (empty) the cache
	 * @return void
	 */
	var _flush = function() {
 	  _cache = {};
	};

	return {
		get: _get,
		set: _set,
		flush: _flush
	};
})();


if(typeof loaded === "undefined") loaded = {};

/**
 * Ajax caller with built in caching (something jquery doesn't offer)
 * Dependencies: cache, utils
 */
loaded.http = function() {

	/**
	 * prepare the data depending on what dataType is (e.g. JSON)
	 * @param mixed data The data to convert to another type (e.g json)
	 * @param string dataType e.g. "json"
	 * @return mixed Prepared data
	 */
	var _prepareData = function (data, dataType) {
		switch(dataType.toUpperCase()) {
			case "JSON":
				data = JSON.parse(data);
				break;
		}
		return data;
	};

	/**
	 * Fetch data from the server
	 */
	var _send = function(options) {

 		// default options
 		options = loaded.utils.extend({
 			success: function() {
				console.log("loaded.http: Success handler not defined");
			},
			error: function() {
				console.log("loaded.http: Error handler not defined");
			},
 			get_cached: false,
 			method: "GET",
 			data_type: "text",
 			data: null
 		}, options);

 		// check cache
 		if(options.get_cached && loaded.cache.get(options.url)) {
 			options.success(_prepareData(loaded.cache.get(options.url), options.data_type), options.data_type);
 			return true;
 		}

 		// make ajax call
 		var xmlhttp;
 		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else {// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

 		xmlhttp.onreadystatechange = function() {
 			if (xmlhttp.readyState==4 && xmlhttp.status==200) {

				// store the cache for later, in the event that
				// TODO use the cache flag, only store if passed
				loaded.cache.set(options.url, xmlhttp.responseText, options.data_type);

				// call the success method
 				options.success(_prepareData(xmlhttp.responseText, options.data_type));

 			} else if (xmlhttp.readyState==4) { // error handler

				// when an error occurs, we will call the developer defined error
				// handler
				options.error(_prepareData(xmlhttp.responseText, options.data_type));
			}
 		}

		// Set header so the called script knows that it's an XMLHttpRequest
		xmlhttp.open(options.method.toUpperCase(), options.url, true);

		// this is required so that the server-side scripts know if is an ajax request
		xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

 		if(options.method.toUpperCase() === 'POST') {
 			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 			var data = function(data) {
 				var pairs = [];
 				for(var name in data) {
 					pairs.push(name+"="+data[name]);
 				}
 				return pairs.join("&");
 			}(options.data);
 			xmlhttp.send(data);
 		} else {
 			xmlhttp.send();
 		}

 	};

	// return public properties and
	return {
		options: {},
		send: _send,
	}

}();


if(typeof loaded === "undefined") loaded = {};

/**
 * Will load and render templates and data
 * Should be initiated with a handler for when html is rerendered
 *
 * Usage:
 *
 * loaded.dispatch.loadTemplate(templatePath); // ajax load, call render
 * loaded.dispatch.loadData(dataPath); // ajax load, call render
 *
 * Dependencies: ajax, utils
 *
 */
loaded.dispatch = (function() {

    /**
     * @var array Stores templates indexed by their url
     */
    var _templatesCache = {};

    /**
     * @var string Stores the current template
     */
    var _template = null;

    /**
     * @var boolean Once the template is loaded, this should be set to true
     */
    var _templateReady = true;

    /**
     * @var mixed Stores the current data
     */
    var _data = null;

    /**
     * @var boolean Once the data is loaded, this should be set to true
     */
    var _dataReady = true;

    /**
     * @var object
     */
    var _config = {

        // where the library can find templates rather than having to
        // specify full path every time when defining routes
        "templates_dir": "/templates",

        // this is the container that will take the rendered html
        "container_id": "loaded-content",

        // debug mode allows us to switch of link default behaviour so we
        // can view js error messages before the page reloads
        "debug_mode": false,

        // this is the render function to handle the template and data from the
        // server
        "render": function() {
            console.log("loaded.dispatch: config.render function not defined");
        },

        // this is the render function to handle the template and data from the
        // server
        "error": function() {
            console.log("loaded.dispatch: config.error_handler function not defined");
        }
    };

    /**
     * Once the template has loaded, this will set the template and flag
     * @param string template The template html etc
     */
    var _setTemplate = function (template) {
        _template = template;
        _templateReady = true;
    };

    /**
     * Return the stored data
     */
    var _getData = function () {
        return _data;
    };

    /**
     * Once the data has loaded, this will set the data and flag
     * @param string data The data for the template
     */
    var _setData = function (data) {
        _data = data;
        _dataReady = true;
    };

    /**
     * Will load the template
     * @param string templatePath The path to the template file
     */
    _loadTemplate = function(templatePath, options) {

        // set default options
        options = loaded.utils.extend({
            get_cached: true
        }, options);

        // attach templates_dir
        templatePath = _config['templates_dir'] + templatePath;

        var cached = _templatesCache[templatePath];

        // load the template
        if (cached) {
            _setTemplate(cached);
            _render();
        } else {

            _template = null;
            _templateReady = false;

            loaded.http.send({
                url: templatePath,
                method: "GET",
                get_cached: options.get_cached,
                success: function (html) {
                    _setTemplate(html);
                    _render();
                }
            });
        }
    }

    /**
     * Will load the data for the template
     * @param string dataPath The path to the resource (e.g. /accounts/1)
     */
    function _loadData(dataPath, options) {

        // set default options
        options = loaded.utils.extend({
            get_cached: false,
        }, options);

        // load the data
        if (dataPath) {

            _data = null;
            _dataReady = false;

            loaded.http.send({
                url: dataPath,
                method: "GET",
                data_type: "json",
                get_cached: options.get_cached,
                success: function (data) {
                    _setData(data);
                    _render();
                },
                error: function(data) {
                    _config.error(data);
                }
            });
        }
    }

    /**
     * The function that is called when the ajax requests have ended
     * It will only run fully when all ajax (template and data) are ready
     * @return void
     */
    var _render = function () {

        // this only passes when we have both sets of data
        if (!_templateReady || !_dataReady) {
            return false;
        }

        // render with out developer defined render function
        _config.render(_template, _data);

        // init new html
        loaded.dispatch.init( _getContainer() );
    };

    /**
     * Set config
     * @param object config New config to merge
     * @return object new config
     */
    var _setConfig = function (config, value) {

        // determine if we're merging a passed in object, or
        // a single name/value
        if (typeof config == "string") {
            _config[config] = value;
        } else {
            _config = loaded.utils.extend(_config, config);
        }

        return _config;
    };

    /**
     * Get config
     * @param object config New config to merge
     * @return object new config
     */
    var _getConfig = function (name) {

        return _config[name];
    };

    /**
     * Get container element
     * @return domElement
     */
    var _getContainer = function () {

        return document.getElementById( _config["container_id"] );
    };

    // /**
    //  * Will set the innerHTML of the configured "container_id" element
    //  * @param string content New html to set
    //  */
    // var _innerHTML = function (html) {
    //
    //     _getContainer().innerHTML = html;
    // };

    /**
     * Init the object by passing the handler when html is rendered to screen
     * @param function handler This will be run every time html is rendered
     * @return void
     */
    var _init = function(container) {

        if ( _getConfig("debug_mode") == true ) {
            console.log("Loaded: Debug mode is ON");
        }

        // set container to document by default
        container = container || document;

        // set all links on page
        var links = container.getElementsByTagName("a");
        for(var i=0; i<links.length; i++) {

            // set link click event behaviour
            links[i].addEventListener("click", function(e) {

                // debug mode allows us to see what is breaking the js without
                // the default brower behaviour loosing the js error in console
                if ( _getConfig("debug_mode") == true ) {
                    e.preventDefault();
                }

                var link = this;

                // if a route exists for this url, load the page with ajax
                var result = loaded.router.match( this.getAttribute("href"), "GET" );
                var current_layout = loaded.router.getCurrentLayout();

                var hasLayout = (result && result.layout != undefined);
                var layoutChanged = (current_layout != null && result.layout != current_layout);
                if (hasLayout && layoutChanged) {

                    // return and let default <a> nature take it's course
                    // if layout is not null, and changed
                    return;

                }

                var isResultCallable = (result && typeof result.value === "function");
                if (isResultCallable) {

                    // call the result with, pass in the href
                    // this will load the template and data
                    result.value(link.href);

                    // update the browser url bar
                    history.pushState({}, '', link.href);

                    // blur link
                    link.blur();

                    // stop a standard http request
                    e.preventDefault();
                }

            }, false);
        }

        // set the layout based on the pathname
        var result = loaded.router.match( window.location.pathname, "GET" );

        // set the layout of this route. the dispatch(?) will determine whether we
        // need to reload the page if the layout changes
        if (result)
            loaded.router.setCurrentLayout( result.layout );

        // set event listener for push state changed
        // this will fire when the back button is pressed, we will loaded the
        // new page based on the updated current pathname
        window.addEventListener('popstate', function(event) {

            // this is somewhat similar to our code above but some differences
            // such as we need to fetch the result based on pathname, not href.
            // perhaps someway to DRY them both out a little?

            // if a route exists for this url, load the page with ajax
            var result = loaded.router.match( window.location.pathname, "GET" );
            var current_layout = loaded.router.getCurrentLayout();

            var hasLayout = (result && result.layout != undefined);
            var layoutChanged = (current_layout != null && result.layout != current_layout);
            if (hasLayout && layoutChanged) {

                // just reload
                window.location.href = window.location.pathname;
            }

            var isResultCallable = (result && typeof result.value === "function");
            if (isResultCallable) {

                // call the result with, pass in the href
                // this will load the template and data
                // TODO how to handle GETs
                result.value(window.location.pathname);
            }
        });
    };

    return {
        loadData: _loadData,
        loadTemplate: _loadTemplate,
        getConfig: _getConfig,
        setConfig: _setConfig,
        getData: _getData,
        setData: _setData,
        getContainer: _getContainer,
        init: _init,
    }
})();


if(typeof loaded === "undefined") loaded = {};

/**
 * This is a stand-alone router that can define routes, and return a value
 * from that given route.
 *
 * Usage:
 *
 * router.get("/", function(url) {...});
 * router.group("/accounts", function(url) {
 *   router.get("/(\\d+)", function(url) {...});
 * });
 *
 */
loaded.router = (function(ajax) {

    /**
    * @var object Stored routes defined by get(), post(), etc
    */
    var _routes = {};

    /**
     * @var string Used to store the current layout
     */
    var _current_layout = null; // when null, layouts are disabled

    /**
     * @var string Only really used as a store for when creating grouped routes
     */
    var _current_group = "";

    /**
    * Loop through routes organised by layout, check each one
    * @param string url The url in question
    * @param string method The method of the reqeust (e.g. GET)
    * @return object|undefined {value: stored_value/handler, params: route_params, layout: route_layout}
    */
    var _match = function(url, method) {

        // if url is missing, or empty return undefined
        if (!url) return undefined;

        // strip trailing slash "/accounts/" -> "/accounts"
        if(url != "/" && url.substr(-1) === "/") {
            url = url.substr(0, url.length - 1);
        }

        // set defaults
        if (! method) method = "GET";

        // loop through each layout and call individually
        for(var layout in _routes) {

            // get result from this layout group
            result = _match_recursive(url, method, _routes[layout], layout);

            // if this layout found a result, return it. don't bother with the other
            // routes
            if (result) {

                return result;
            }
        }
    };

    /**
    * Match a route with a url
    * @param string url The url in question
    * @param string method The method of the reqeust (e.g. GET)
    * @param string config The routes in config (Internal use only)
    * @param string layout The current config routes layout, to set in result
    * @param string pattern The pattern which may include group(s) (The routes in config (Internal use only))
    * @param object result The result object to pass through and set if matched
    * @return object|undefined {value: stored_value/handler, params: route_params, layout: route_layout}
    */
    var _match_recursive = function(url, method, config, layout, pattern, result) {

        if (! pattern) pattern = "";

        // we will dig though all items in routes array. when we reach METHODS
        // we can compare the routes and return that methods params (e.g. template)
        // if a match is found
        for(var key in config) {

            // all pattern level object keys begin with "/...". the script will
            // assume that the next level keys will be methods (e.g. GET, POST)
            if(key.charAt(0) === '/') {

                // we will dig deeper, as we're not done yet. in the next recursion we will
                // obtain the method and do a comparison
                result = _match_recursive(url, method, config[key], layout, pattern+key, result);

            // so we are looking at a METHOD here, but skip if not the METHOD we're
            // looking for
            } else if (key != method) {

                continue;

            } else {

                // right trim pattern and url
                if(pattern.length > 1) {
                    pattern = pattern.replace(/\/+$/, "");
                }

                // compare the pattern and the url
                pattern = "^" + pattern + "$";
                var re = new RegExp(pattern);
                var params = re.exec(url);

                // this is the only time that
                if(params) {
                    params.shift() // we don't need the string
                    result = {};
                    result.value = config[key]
                    result.params = params
                    result.layout = layout
                }
            }
        }

        return result;
    }

    /**
    * Match a route with a url, store a value to that route to be returned on match
    * @param string pattern The pattern to match routes
    * @param mixed value The value to store and return on match
    * @return void
    */
    var _get = function(pattern, value) {

        return _addRoute(pattern, "GET", value);
    }

    /**
    * Match a route with a url, store a value to that route to be returned on match
    * @param string pattern The pattern to match routes
    * @param mixed value The value to store and return on match
    * @return void
    */
    var _post = function(pattern, value) {

        //
        return _addRoute(pattern, "POST", value);
    }

    /**
    * Match a route with a url, store a value to that route to be returned on match
    * @param string pattern The pattern to match routes
    * @param mixed value The value to store and return on match
    * @return void
    */
    var _put = function(pattern, value) {

        //
        return _addRoute(pattern, "PUT", value);
    }

    /**
    * Match a route with a url, store a value to that route to be returned on match
    * @param string pattern The pattern to match routes
    * @param mixed value The value to store and return on match
    * @return void
    */
    var _delete = function(pattern, value) {

        //
        return _addRoute(pattern, "DELETE", value);
    }

    /**
    * Used by the _get, _post, etc methods as they only differ in method alone
    * @param string pattern The pattern to match routes
    * @param string method Method to store this as
    * @param mixed value The value to store and return on match
    * @return void
    */
    var _addRoute = function(pattern, method, value) {

        // prepend the group
        var pattern = _current_group + pattern;

        // ensure the indexes exists, or we get a js error
        _routes[_current_layout] = _routes[_current_layout] || {};
        _routes[_current_layout][pattern] = _routes[_current_layout][pattern] || {};

        // set the route object
        _routes[_current_layout][pattern][method] = value;
    }

    /**
    * Define the layout for a group of routes. This let's the router know
    * when to do a fresh reload
    * @param string name Name to identify the layout
    * @param string routes Function of route definitions
    * @return void
    */
    var _layout = function(name, routes) {

        // we'll use current layout to define routes, but revert back to
        // it's previous value
        var current_layout = _current_layout;

        _current_layout = name;
        routes();
        _current_layout = current_layout; //restore
    }

    /**
    * Group
    * @param string name Name to identify the group
    * @param string routes Function of route definitions
    * @return void
    */
    var _group = function(name, routes) {

        // we'll use current group to define routes, but revert back to
        // it's previous value
        var current_group = _current_group;

        _current_group = _current_group + name;
        routes();
        _current_group = current_group; //restore
    }

    /**
    * Set the current url
    * @param string current_layout New current layout
    * @return void
    */
    var _getCurrentLayout = function(current_layout) {

        return _current_layout;
    }

    /**
    * Set the current url
    * @param string current_layout New current layout
    * @return void
    */
    var _setCurrentLayout = function(current_layout) {

        _current_layout = current_layout;
    }

    /**
    * Set the current url
    * @param string current_layout New current layout
    * @return void
    */
    var _getRoutes = function() {

        return _routes;
    }


    // return public properties and
    return {
        match: _match,
        get: _get,
        post: _post,
        put: _put,
        delete: _delete,
        layout: _layout,
        group: _group,
        setCurrentLayout: _setCurrentLayout,
        getCurrentLayout: _getCurrentLayout,
        getRoutes: _getRoutes
    }
})();


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
