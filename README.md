# Loaded

A JavaScript library to assist loading templates (e.g. handlebars) and data files (e.g. json) based on defined routes. Suite to websites that use shared templates too.

Allows for graceful degradation when the same resource is used for the standard page loads (href) as for the data file. If the library should throw an error, it will fallback to the link default.

Also, this library does not require that you put JavaScript specific data inside the HTML. All JavaScript defined for the loading and rendering of templates and data can be written entirely in the JavaScript. This is a much more decoupled approach.

## Installation

...

## Routing & Dispatch

When a route is defined and matches the href of a link, the library will can the passed in callback function of that route:

```javascript
loaded.router.get("/", function() {
    alert("Hello world");
});
```

Matching a route

```javascript
value = loaded.router.match("/", "GET");
value(); // alert: Hello world
```

The router can be used independently but the library's dispatch tool can be used to load the templates and data:

Static pages (no data)

```javascript
// only template is loaded and rendered
loaded.router.get("/", function(resource) {
    loaded.dispatch.loadTemplate('/templates/index/index.handlebars');
});
```

Data pages

```javascript
// template and data are automatically compiled and rendered to screen.
loaded.router.get("/", function(resource) {
    loaded.dispatch.loadTemplate('/templates/index/index.handlebars');
    loaded.dispatch.loadData('/path/to/datafile');
});
```

Groups

Groups simply allow routes of the same resource to be grouped together.

```javascript
loaded.router.group("/admin", function() {

    // match "/admin"
    loaded.router.get("/", function(resource) {
        loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        loaded.dispatch.loadData("/api/getlist.php");
    });

    // match "/admin/1"
    loaded.router.get("/(\\d+)", function(resource) {
        loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        loaded.dispatch.loadData(resource + "?format=json");
    });
});
```

Layouts

Routes can be grouped by their HTML layout. If the library detects a new route is a different layout from the previous one, it will reload the page to ensure the layout is updated.

```javascript
loaded.router.layout("default", function() {
    loaded.router.get("/", function(resource) {
        loaded.dispatch.loadTemplate('/templates/index/index.handlebars');
    });
});

loaded.router.layout("admin_layout", function() {
    loaded.router.group("/admin", function() {
        loaded.router.get("/", function(resource) {
            loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        });
        loaded.router.get("/(\\d+)", function(resource) {
            loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        });
    });
});
```

## Configuration

```javascript
loaded.dispatch.config({
    "templates_dir": "/templates",
    "data_format": "json",
});
```

TODO

* tests - dispatch, ajax, cache: mock ajax calls 
* require - make each module of loaded, a require module :)
* history
