var require = {
    paths: {
        "ammo": "/lib/ammo/ammo",
        "firstpersoncontrols": "controls/FirstPersonControls",
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
        "firstpersoncontrols": ["three"]
    }
};