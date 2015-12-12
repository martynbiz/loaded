(function(loaded) {

    QUnit.module( "loaded.dispatch", function(hooks) {

        QUnit.module( "loaded.dispatch.setConfig", function(hooks) {

            // ====================================
            // setup

            hooks.beforeEach( function() {
                loaded.dispatch.setConfig("mykey", null);
            } );

            // ====================================
            // tests

            QUnit.test( "Dispatch: Test setConfig with object", function( assert ) {

                loaded.dispatch.setConfig({
                    "mykey": "myvalue"
                });
                var stored = loaded.dispatch.getConfig("mykey");

                assert.equal( "myvalue", stored );
            });

            QUnit.test( "Dispatch: Test setConfig with name/value", function( assert ) {

                loaded.dispatch.setConfig("mykey", "myvalue");
                var stored = loaded.dispatch.getConfig("mykey");

                assert.equal( "myvalue", stored );
            });

            QUnit.test( "Dispatch: container_id is 'content' by default", function( assert ) {

                var stored = loaded.dispatch.getConfig("container_id");

                assert.equal( "loaded-content", stored );
            });

        });

    });

})(loaded);
