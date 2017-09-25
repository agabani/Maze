var require = {
    paths: {
        "ammo": "/lib/ammo/ammo",
        "app": "app/app",
        "camera": "app/camera",
        "clock": "app/clock",
        "controls": "app/controls",
        "datgui": "/lib/dat.gui/build/dat.gui",
        "jquery": "/lib/jquery/dist/jquery",
        "lighting": "app/lighting",
        "mazelevel": "app/levels/mazelevel",
        "meshfactory": "app/meshfactory",
        "raycaster": "app/raycaster",
        "renderer": "app/renderer",
        "sandboxlevel": "app/levels/sandboxlevel",
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