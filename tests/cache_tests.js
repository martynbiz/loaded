QUnit.module( "loaded.cache", function(hooks) {

    var mykey = 'mykey',
        myvalue = 'myvalue';

    // ====================================
    // tests

    QUnit.test( "Test get/set", function( assert ) {

        loaded.cache.set(mykey, myvalue);
        var stored = loaded.cache.get(mykey);

        assert.equal( myvalue, stored );
    });

});
