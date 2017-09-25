define("camera",
    ["three"],
    function(THREE) {
        "use strict";

        var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.2, 2000);

        return camera;
    });