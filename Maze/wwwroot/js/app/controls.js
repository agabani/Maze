define("controls",
    ["three", "orbitcontrols"],
    function(THREE) {
        "use strict";

        var orbitcontrols = function(camera) {
            return new THREE.OrbitControls(camera);
        };

        return {
            orbitcontrols: orbitcontrols
        };
    });