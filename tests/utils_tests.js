(function(loaded) {

    // ====================================
    // setup




    // ====================================
    // tests

    QUnit.test( "Utils: ", function( assert ) {
        var actual = loaded.utils.extend({"option1": true}, {"option2": false});
        var expected = {"option1": true, "option2": false};

        // we use deepEqual as we're comparing values, not same instance
        assert.deepEqual( expected, actual );
    });

})(loaded);
