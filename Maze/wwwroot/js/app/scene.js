define("scene",
    ["three"],
    function(THREE) {
        "use strict";

        var scene = new THREE.Scene();

        scene.background = new THREE.Color(0xbfd1e5);
        scene.fog = new THREE.FogExp2(0xffffff, 0.00015);

        return scene;
    });