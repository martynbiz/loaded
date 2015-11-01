# Loaded

A JavaScript library to assist loading templates (e.g. handlebars) and data files (e.g. json) based on defined routes. Suite to websites that use shared templates too.

## Installation

...

## Routing & Dispatch

When a route is defined and matches the href of a link, the library will can the passed in callback function of that route:

```
loaded.router.get("/", function(url) {
    alert("This is the homepage");
});
```

The router can be used independently but the library's dispatch tool can be used to load the templates and data:

Static pages (no data)

```
// only template is loaded and rendered
loaded.router.get("/", function(url) {
    loaded.dispatch.loadTemplate('/templates/index/index.handlebars');
});
```

Data pages

```
// template and data are automatically compiled and rendered to screen.
loaded.router.get("/", function(url) {
    loaded.dispatch.loadTemplate('/templates/index/index.handlebars');
    loaded.dispatch.loadData('/path/to/datafile');
});
```

Groups

Groups simply allow routes of the same resource to be grouped together.

```
loaded.router.group("/admin", function() {

    // match "/admin"
    loaded.router.get("/", function(url) {
        loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        loaded.dispatch.loadData("/api/getlist.php");
    });

    // match "/admin/1"
    loaded.router.get("/(\\d+)", function(url) {
        loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        loaded.dispatch.loadData(url + "?format=json");
    });
});
```

Layouts

Routes can be grouped by their HTML layout. If the library detects a new route is a different layout from the previous one, it will reload the page to ensure the layout is updated.

```
loaded.router.layout("default", function() {
    loaded.router.get("/", function(url) {
        loaded.dispatch.loadTemplate('/templates/index/index.handlebars');
    });
});

loaded.router.layout("admin_layout", function() {
    loaded.router.group("/admin", function() {
        loaded.router.get("/", function(url) {
            loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        });
        loaded.router.get("/(\\d+)", function(url) {
            loaded.dispatch.loadTemplate('/templates/admin/index/index.handlebars');
        });
    });
});
```

## Configuration

```
loaded.dispatch.config({
    "templates_dir": "/templates",
    "data_format": "json",
});
```

TODO

* tests
* require