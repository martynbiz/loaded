/**
 * TODO tests, require
 */

(function() {

    // init will load the init function to run when html is rendered
    loaded.dispatch.init( function(container) {

        // set current layout TODO

        // set all links on page
        var links = container.getElementsByTagName("a");
        for(var i=0; i<links.length; i++) {

            // set link click event behaviour
            links[i].addEventListener("click", function(e) {

                // if a route exists for this url, load the page with ajax
                var handler = loaded.router.match( this.getAttribute("href"), "GET" );

                if(handler) {

                    // call the handler with, pass in the href
                    handler(this.href);

                    // update the browser url bar
                    history.pushState({}, '', this.href);

                    // blur link
                    this.blur();

                    // stop a standard http request
                    e.preventDefault();
                }

            }, false);
        }
    });
})();
