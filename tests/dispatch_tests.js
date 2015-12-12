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

                assert.strictEqual( "myvalue", stored );
            });

            QUnit.test( "Dispatch: Test setConfig with name/value", function( assert ) {

                loaded.dispatch.setConfig("mykey", "myvalue");
                var stored = loaded.dispatch.getConfig("mykey");

                assert.strictEqual( "myvalue", stored );
            });

            QUnit.test( "Dispatch: test default config values are set", function( assert ) {

                assert.strictEqual( loaded.dispatch.getConfig("container_id"), "loaded-content" );
                assert.strictEqual( loaded.dispatch.getConfig("templates_dir"), "/templates" );
                assert.strictEqual( loaded.dispatch.getConfig("debug_mode"), false );
            });

        });

    });

})(loaded);
