(function(loaded) {

    // ====================================
    // test data

    var mykey = 'mykey',
        myvalue = 'myvalue';

    // ====================================
    // tests

    QUnit.test( "Cache: Test get/set", function( assert ) {

        loaded.cache.set(mykey, myvalue);
        var stored = loaded.cache.get(mykey);

        assert.equal( myvalue, stored );
    });

})(loaded);
