
/**
 * everything is wrapped in a "factory" function which pass in the dependencies
 * it can be used when detecting whether requirejs is installed, and to create a
 * requirejs module, or whether to just return the module to the global namespace.
 * See also amd-start.js
 * @author Martyn Bissett
 */



    return loaded;
}

// this condition will check if require is installed (by the presense of define) and
// use the factory function to define the module with dependencies. Otherwise, just
// set the global loaded variable
if(typeof define === "function" && define.amd) {
    define(["jquery", "handlebars"], factory);
}
else {
    loaded = factory(jQuery, Handlebars);
}
