/**
 * TODO tests, require
 */

(function() {

    // set the layout based on the pathname
    var result = loaded.router.match( window.location.pathname, "GET" );

    if (result)
        loaded.router.setCurrentLayout(result.layout);

    // init will load the init function to run when html is rendered
    loaded.dispatch.init( function(container) {

        // set all links on page
        var links = container.getElementsByTagName("a");
        for(var i=0; i<links.length; i++) {

            // set link click event behaviour
            links[i].addEventListener("click", function(e) {

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
    });
})();
