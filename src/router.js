
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
    var _current_layout = "default"; // TODO set this onload

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
        // url.replace(/\/+$/, "");
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

                // same layout? if not, fresh load
                if (result.layout != _current_layout) {

                    // layout has changed, return null so a fresh reload will happen
                    return undefined;
                }

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
                var re = new RegExp("^" + pattern + "$");
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


    // return public properties and
    return _this = { // _this allows us to?
        match: _match,
        get: _get,
        post: _post,
        put: _put,
        delete: _delete,
        layout: _layout,
        group: _group,
    }
})();
