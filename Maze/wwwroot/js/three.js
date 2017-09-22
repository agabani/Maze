define("three",
    ["/lib/three.js/build/three.js"],
    function(THREE) {
        window.THREE = THREE;
        return THREE;
    })