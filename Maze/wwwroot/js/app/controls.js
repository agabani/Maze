define("controls",
    ["three", "camera", "orbitcontrols"],
    function(THREE, camera) {
        "use strict";

        var controls = new THREE.OrbitControls(camera);

        return controls;
    });