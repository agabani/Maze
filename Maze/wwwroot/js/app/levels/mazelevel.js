define("mazelevel",
    ["three", "meshfactory"],
    function(THREE, meshfactory) {
        "use strict";

        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();

        function init(scene, physicsWorld, rigidBodies) {
            ground(scene, physicsWorld);
            walls(scene, physicsWorld);
        }

        function interaction(scene, physicsWorld, rigidBodies, raycaster) {

        }

        function ground(scene, physicsWorld) {
            pos.set(0, - 0.5, 0);
            quat.set(0, 0, 0, 1);
            var ground = new meshfactory.Ground({ pos: pos, quat: quat });
            scene.add(ground.mesh);
            physicsWorld.addRigidBody(ground.body);
        }

        function walls(scene, physicsWorld) {
            pos.set(-20.5, 0.5, 0);
            wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, scene, physicsWorld);

            pos.set(20.5, 0.5, 0);
            wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, scene, physicsWorld);

            pos.set(0, 0.5, -20.5);
            wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, scene, physicsWorld);

            pos.set(0, 0.5, 20.5);
            wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, scene, physicsWorld);

            for (var x = -20.5; x < 20.5; x += 2.75) {
                pos.set(x, 0.5, 0);
                wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 38 }, scene, physicsWorld);
            }
        }

        function wall(options, scene, physicsWorld) {
            var wall = new meshfactory.Wall(options);
            scene.add(wall.mesh);
            physicsWorld.addRigidBody(wall.body);
        }

        return {
            init: init,
            interaction: interaction
        };
    });