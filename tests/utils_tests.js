QUnit.module( "loaded.utils", function(hooks) {

    // ====================================
    // tests

    QUnit.test( "Test extends", function( assert ) {
        var actual = loaded.utils.extend({"option1": true}, {"option2": false});
        var expected = {"option1": true, "option2": false};

        // we use deepEqual as we're comparing values, not same instance
        assert.deepEqual( expected, actual );
    });

});
