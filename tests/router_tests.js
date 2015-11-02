// ====================================
// configure the router

loaded.router.get("/", function() {
    return "home";
});

loaded.router.group("/accounts", function() {

    loaded.router.get("/", function() {
        return "accounts list";
    });
    loaded.router.get("/(\\d+)", function() {
        return "accounts get";
    });
    loaded.router.post("/(\\d+)", function() {
        return "accounts post";
    });
    loaded.router.put("/(\\d+)", function() {
        return "accounts put";
    });
    loaded.router.get("/new", function() {
        return "accounts new";
    });
    loaded.router.get("/(\\d+)/edit", function() {
        return "accounts edit";
    });
});


// ====================================
// basic get tests

// home

QUnit.test( "Test GET '/' route", function( assert ) {
    handler = loaded.router.match( "/", "GET" );
    assert.equal( handler(), "home", "Passed!" );
});

// without backslash
QUnit.test( "Test GET '' route", function( assert ) {
    handler = loaded.router.match( "", "GET" );
    assert.equal( handler(), "home", "Passed!" );
});

// accounts list

QUnit.test( "Test GET '/accounts' route", function( assert ) {
    handler = loaded.router.match( "/accounts", "GET" );
    assert.equal( handler(), "accounts list", "Passed!" );
});

// with trailing slash
QUnit.test( "Test GET '/accounts/' route", function( assert ) {
    handler = loaded.router.match( "/accounts/", "GET" );
    assert.equal( handler(), "accounts list", "Passed!" );
});

// accounts new

QUnit.test( "Test GET '/accounts/new' route", function( assert ) {
    handler = loaded.router.match( "/accounts/new", "GET" );
    assert.equal( handler(), "accounts new", "Passed!" );
});

// accounts get

QUnit.test( "Test GET '/accounts/1' route", function( assert ) {
    handler = loaded.router.match( "/accounts/1", "GET" );
    assert.equal( handler(), "accounts get", "Passed!" );
});

// accounts edit

QUnit.test( "Test GET '/accounts/1/edit' route", function( assert ) {
    handler = loaded.router.match( "/accounts/1/edit", "GET" );
    assert.equal( handler(), "accounts edit", "Passed!" );
});
