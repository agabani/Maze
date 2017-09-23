var require = {
    paths: {
        "ammo": "/lib/ammo/ammo",
        "camera": "app/camera",
        "clock": "app/clock",
        "controls": "app/controls",
        "lighting": "app/lighting",
        "raycaster": "app/raycaster",
        "renderer": "app/renderer",
        "scene": "app/scene",
        "stats": "/lib/stats.js/build/stats.min",
        "stats-glue": "lib/stats-glue",
        "three": "/lib/three.js/build/three",
        "three-glue": "lib/three-glue",
        "firstpersoncontrols": "app/controls/FirstPersonControls",
        "orbitcontrols": "app/controls/OrbitControls"
    },
    map: {
        "*": {
            three: "three-glue",
            stats: "stats-glue"
        },
        "three-glue": {
            three: "three"
        },
        "stats-glue": {
            stats: "stats"
        }
    },
    shim: {
        "firstpersoncontrols": ["three"],
        "orbitcontrols": ["three"]
    }
};