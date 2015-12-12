QUnit.module( "loaded.http", function(hooks) {

    // setup some constants as test data from the server
    // *_TEXT will not parse as json
    var FIRST_CALL_TEXT = '"first call"', // no JSON parsing
        SECOND_CALL_TEXT = '"second call"',
        FIRST_CALL_JSON = 'first call', // after JSON parsing
        SECOND_CALL_JSON = 'second call';

    // this will be set in each test. the request handle function is
    // set to shift items from this array. By doing this we can create
    // data for consecutive calls within the same test.
    // e.g. expectedDataFromProvider = [FIRST_CALL_TEXT, SECOND_CALL_TEXT]
    var expectedDataFromProvider = [];

    // MockHttpServer is used to mock the xmlhttprequest calls
    // https://github.com/philikon/MockHttpRequest
    // TODO find another library that tests for the data passed to xhr
    var server = new MockHttpServer();

    // this is the handler for tests. set expectedDataFromProvider in each test
    server.handle = function (request) {
        request.setResponseHeader("Content-Type", "application/robot");
        request.receive(200, expectedDataFromProvider.shift());
    };

    // ====================================
    // tests

    // this will start the MockHttpServer server so that xmlhttprequest object
    // is not used for http requests
    server.start();

    QUnit.test( "Test send returns expected data", function( assert ) {

        expectedDataFromProvider = [FIRST_CALL_TEXT];

        loaded.http.send({
            success: function(actualData) {
                assert.equal( FIRST_CALL_TEXT, actualData );
            },
            url: 'some_resource.php',
        });


    });

    QUnit.test( "Test send when get_cached is not set (default: false)", function( assert ) {

        expectedDataFromProvider = [FIRST_CALL_TEXT, SECOND_CALL_TEXT];

        loaded.http.send({
            success: function(actualData) {
                assert.equal( FIRST_CALL_TEXT, actualData );
            },
            url: 'some_resource.php',
        });

        loaded.http.send({
            success: function(actualData) {
                assert.equal( SECOND_CALL_TEXT, actualData );
            },
            url: 'some_resource.php',
        });
    });

    QUnit.test( "Test send when get_cached is true", function( assert ) {

        expectedDataFromProvider = [FIRST_CALL_TEXT, SECOND_CALL_TEXT];

        loaded.http.send({
            success: function(actualData) {
                assert.equal( FIRST_CALL_TEXT, actualData );
            },
            url: 'some_resource.php',
        });

        loaded.http.send({
            success: function(actualData) {
                assert.equal( FIRST_CALL_TEXT, actualData );
            },
            url: 'some_resource.php',
            get_cached: true
        });
    });

    QUnit.test( "Test send when data_type is 'json'", function( assert ) {

        expectedDataFromProvider = [FIRST_CALL_TEXT];

        loaded.http.send({
            success: function(actualData) {
                assert.equal( FIRST_CALL_JSON, actualData );
            },
            url: 'some_resource.php',
            data_type: "json"
        });
    });

});
