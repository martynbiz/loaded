# Loaded

A JavaScript library to assist loading templates (e.g. handlebars) and data files (e.g. json) based on defined routes. Suite to websites that use shared templates too.

Allows for graceful degradation when the same resource is used for the standard page loads (href) as for the data file. If the library should throw an error, it will fallback to the link default.

Also, this library does not require that you put JavaScript specific data inside the HTML. All JavaScript defined for the loading and rendering of templates and data can be written entirely in the JavaScript. This is a much more decoupled approach.

## Installation

Include the loaded library to your HTML:

```html
<script src="loaded.js">
```

Or the minified version:

```html
<script src="loaded.min.js">
```

### AMD Module

Loaded can also be loaded as an AMD module for use in Requirejs:

```html
<script src="loaded-amd.js">
```

## Quick start

To use loaded, all that is required is to define a few routes, and initiate the library.

In the HTML, there should be a container element that we'll set our rendered HTML(e.g.
template + data):

```html
<html>
<head>
</head>
<body>
  <h1>My loaded app</h1>
  <ul>
    <li><a href="/">Home</a>
    <li><a href="/products">Products</a>
  </ul>
  <div id="loaded-content"></div>
</body>
</html>
```

Next, we define all the routes that Loaded will load by Ajax requests:

```javascript
loaded.router.get("/", function(href) {
    loaded.dispatch.loadTemplate('/index/index.handlebars');
});

loaded.router.get("/products", function(href) {
    loaded.dispatch.loadTemplate('/products/index.handlebars');
    loaded.dispatch.loadData(href); // GET /products
});
```

Then, we set the render function which is called when the template and data is ready.
In the example below, we're using Handlebars templates to render HTML:

```javascript
loaded.dispatch.setConfig({
    "render": function(template, data) {
        var render = Handlebars.compile(template);
        loaded.dispatch.setHTML( render(data) )
    }
});
```

Lastly, we run the init function to initiate links etc now that configuration is setup:

```javascript
loaded.dispatch.init();
```

And that's pretty much all that is required. Ofcourse in your app you'll probably will
have many more routes defined.

## Components ##

The next few sections discuss the components in more detail:

### Routing & Dispatch

Routes are defined with a callback:

```javascript
loaded.router.get("/", function() {
    alert("Hello world");
});

result = loaded.router.match("/", "GET");
result.value(); // alert: Hello world
```

```javascript

// link <a href="..."
result = loaded.router.match(link.href, "GET");

if (result && result.value typeof "function")
    result.value(); // callback for the route
```

The router can be used independently but the library's dispatch tool can also be
used with the router to load somes templates and data:

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

#### Configuration

```javascript
// name/value pair
loaded.dispatch.setConfig("templates_dir", "/templates");

// multiple configs
loaded.dispatch.setConfig({

    // where the library can find templates rather than having to
    // specify full path every time when defining routes
    "templates_dir": "/templates",

    // this is the container that will take the rendered html
    "container_id": "loaded-content",

    // debug mode allows us to switch of link default behaviour so we
    // can view js error messages before the page reloads
    "debug_mode": false
});
```

## HTTP

The HTTP module makes AJAX requests to the server. It has no dependencies (e.g. jQuery) and
also permits caching which is handle for template files (no need to keep fetching the same
static template files)

```javascript
loaded.http.send({
    url: "/path/to/resource",
    method: "GET",
    get_cached: true,
    success: function (html) {
        // do something
    }
});
```

## Cache

Loaded also has it's own cache module which can be re-used for any purpose

```javascript
loaded.cache.set("mykey", "myvalue");
var cached = loaded.cache.get("mykey"); // myvalue
```

Setting a time limit (ms) on cached items (TODO)

```javascript
loaded.cache.set("mykey", "myvalue", 3000);
```


TODO

* docs for http, update all docs
* tests - more dispatch
* better xhr mock library
* history back button - handle query strings
* put a time limit on cache
* timelimit on cached items
