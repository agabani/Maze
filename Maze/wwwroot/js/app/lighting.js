define("lighting",
    ["three"],
    function(THREE) {
        "use strict";

        var ambientLight = function() {
            var light = new THREE.AmbientLight(0x404040);
            return light;
        };

        var directionalLight = function() {
            var light = new THREE.DirectionalLight(0xffffff, 2);
            light.position.set(1, 1, 0.5).normalize();
            light.castShadow = true;

            var d = 20;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.near = 2;
            light.shadow.camera.far = 50;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            //light.shadowDarkness = 0.65;

            return light;
        };

        return {
            ambientLight: ambientLight,
            directionalLight: directionalLight
        };
    });