
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
     * Init the object by passing the handler when html is rendered to screen
     * @param function handler This will be run every time html is rendered
     * @return void
     */
    var _init = function (handler) {

        // set the callback when we re-render
        _initLinks = handler;

        // call it once with window as container
        _initLinks(document);
    };

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

    var _pushStatePath = "";

    /**
     * Once the template has loaded, this will set the template and flag
     * @param string template The template html etc
     */
    var _setTemplate = function (template) {
        _template = template;
        _templateReady = true;
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
    _loadTemplate = function(templatePath) {

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

            $.ajax({
                url: templatePath,
                method: "GET"
            }).done(function (html) {
                _templatesCache[templatePath] = html;
                _setTemplate(html);
                _render();
            });
        }
    }

    /**
     * Will load the data for the template
     * @param string dataPath The path to the resource (e.g. /accounts/1)
     */
    function _loadData(dataPath) {

        // load the data
        if (dataPath) {

            _data = null;
            _dataReady = false;

            $.ajax({
                url: dataPath,
                method: "GET",
                dataType: "json"
            }).done(function (data) {
                _setData(data);
                _render();
            });
        }
    }

    /**
     * The function that is called when the ajax requests have ended
     * It will only run fully when all ajax (template and data) are ready
     * @return void
     */
    var _render = function () {

        if (!_templateReady || !_dataReady) {
            return false;
        }

        var template = Handlebars.compile(_template);

        var container = document.getElementById("content");
        container.innerHTML = template(_data);

        // re-assign behaviour to links in new html
        _initLinks( container );
    };

    /**
     * @var object
     */
    var _config = {
        'templates_dir': ''
    };

    /**
     * Get set config
     * @param object config New config to merge
     * @return object new config
     */
    var _setConfig = function (config) {

        _config = loaded.utils.extend(_config, config);

        return _config;
    };

    return {
        loadData: _loadData,
        loadTemplate: _loadTemplate,
        init: _init,
        config: _setConfig
    }
})();
