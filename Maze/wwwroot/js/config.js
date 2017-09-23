var require = {
    paths: {
        "ammo": "/lib/ammo/ammo",
        "camera": "app/camera",
        "clock": "app/clock",
        "controls": "app/controls",
        "firstpersoncontrols": "controls/FirstPersonControls",
        "orbitcontrols": "controls/OrbitControls",
        "renderer": "app/renderer",
        "scene": "app/scene",
        "stats": "/lib/stats.js/build/stats.min",
        'three': "/lib/three.js/build/three",
        "three-glue": "three-glue"
    },
    map: {
        "*": {
            three: "three-glue"
        },
        "three-glue": {
            three: "three"
        }
    },
    shim: {
        "firstpersoncontrols": ["three"],
        "orbitcontrols": ["three"]
    }
};