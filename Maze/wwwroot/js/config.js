var require = {
    paths: {
        "ammo": "/lib/ammo/ammo",
        "camera": "app/camera",
        "clock": "app/clock",
        "controls": "app/controls",
        "firstpersoncontrols": "controls/FirstPersonControls",
        "orbitcontrols": "controls/OrbitControls",
        "raycaster": "app/raycaster",
        "renderer": "app/renderer",
        "scene": "app/scene",
        "stats": "/lib/stats.js/build/stats.min",
        "stats-glue": "app/stats",
        "three": "/lib/three.js/build/three",
        "three-glue": "three-glue"
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