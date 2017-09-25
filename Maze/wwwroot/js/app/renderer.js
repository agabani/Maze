define("renderer",
    ["three"],
    function(THREE) {
        "use strict";

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xbfd1e5);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        return renderer;
    });