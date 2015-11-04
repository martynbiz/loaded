
/**
 * everything is wrapped in a "factory" function which pass in the dependencies
 * it can be used when detecting whether requirejs is installed, and to create a
 * requirejs module, or whether to just return the module to the global namespace.
 * See also amd-end.js
 * @author Martyn Bissett
 */
var factory = function($, Handlebars) {
