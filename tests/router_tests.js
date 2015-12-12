QUnit.module( "loaded.router", function(hooks) {

    loaded.router.get("/", "home");

    loaded.router.group("/accounts", function() {
        loaded.router.get("/", "accounts list");
        loaded.router.get("/(\\d+)", "accounts get");
        loaded.router.post("/", "accounts post");
        loaded.router.put("/(\\d+)", "accounts put");
        loaded.router.get("/new", "accounts new");
        loaded.router.get("/(\\d+)/edit", "accounts edit");
    });

    loaded.router.layout("home_layout", function() {
        loaded.router.group("/articles", function() {
            loaded.router.get("/", "articles list");
            loaded.router.get("/(\\d+)", "articles get");
        });
    });

    loaded.router.layout("catalog_layout", function() {
        loaded.router.group("/catalog", function() {
            loaded.router.get("/", "catalog list");
            loaded.router.get("/(\\d+)", "catalog get");
        });
    });


    // ====================================
    // tests

    // basic get tests, groups

    // home

    QUnit.test( "Test GET '/' route", function( assert ) {
        result = loaded.router.match( "/", "GET" );
        assert.equal( result.value, "home", "Passed!" );
    });

    // accounts list

    QUnit.test( "Test GET '/accounts' route", function( assert ) {
        result = loaded.router.match( "/accounts", "GET" );
        assert.equal( result.value, "accounts list", "Passed!" );
    });

    // with trailing slash
    QUnit.test( "Test GET '/accounts/' (trailing slash) route", function( assert ) {
        result = loaded.router.match( "/accounts/", "GET" );
        assert.equal( result.value, "accounts list", "Passed!" );
    });

    // accounts new

    QUnit.test( "Test GET '/accounts/new' route", function( assert ) {
        result = loaded.router.match( "/accounts/new", "GET" );
        assert.equal( result.value, "accounts new", "Passed!" );
    });

    // accounts get

    QUnit.test( "Test GET '/accounts/1' route", function( assert ) {
        result = loaded.router.match( "/accounts/1", "GET" );
        assert.equal( result.value, "accounts get", "Passed!" );
        assert.equal( result.params[0], "1", "Passed!" );
    });

    QUnit.test( "Test GET '/accounts/1/' (trailing slash) route", function( assert ) {
        result = loaded.router.match( "/accounts/1/", "GET" );
        assert.equal( result.value, "accounts get", "Passed!" );
        assert.equal( result.params[0], "1", "Passed!" );
    });

    // accounts edit

    QUnit.test( "Test GET '/accounts/1/edit' route", function( assert ) {
        result = loaded.router.match( "/accounts/1/edit", "GET" );
        assert.equal( result.value, "accounts edit", "Passed!" );
        assert.equal( result.params[0], "1", "Passed!" );
    });


    // post, put etc

    QUnit.test( "Test POST '/accounts' route", function( assert ) {
        result = loaded.router.match( "/accounts", "POST" );
        assert.equal( result.value, "accounts post", "Passed!" );
    });

    QUnit.test( "Test PUT '/accounts/1' route", function( assert ) {
        result = loaded.router.match( "/accounts/1", "PUT" );
        assert.equal( result.value, "accounts put", "Passed!" );
        assert.equal( result.params[0], "1", "Passed!" );
    });


    // route doesn't exist

    // non-route
    QUnit.test( "Test GET '/idontexist' route returns undefined", function( assert ) {
        result = loaded.router.match( "/idontexist", "GET" );
        assert.equal( result, undefined, "Passed!" );
    });

    // without backslash
    QUnit.test( "Test GET '' route returns undefined", function( assert ) {
        result = loaded.router.match( "", "GET" );
        assert.equal( result, undefined, "Passed!" );
    });


    // test layouts

    QUnit.test( "Test GET '/articles/1' route", function( assert ) {
        result = loaded.router.match( "/articles/1", "GET" );
        assert.equal( result.value, "articles get", "Passed!" );
        assert.equal( result.params[0], "1", "Passed!" );
        assert.equal( result.layout, "home_layout", "Passed!" );
    });

    QUnit.test( "Test GET '/catalog/1' route", function( assert ) {
        result = loaded.router.match( "/catalog/1", "GET" );
        assert.equal( result.value, "catalog get", "Passed!" );
        assert.equal( result.params[0], "1", "Passed!" );
        assert.equal( result.layout, "catalog_layout", "Passed!" );
    });


    // current layout getter/setter

    QUnit.test( "Test current layout getter/setter", function( assert ) {
        new_current_layout = "new_layout";

        loaded.router.setCurrentLayout(new_current_layout);
        result = loaded.router.getCurrentLayout();

        assert.equal( result, new_current_layout, "Passed!" );
    });

});
