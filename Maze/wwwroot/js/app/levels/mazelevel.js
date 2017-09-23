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
            var wall1 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 });
            scene.add(wall1.mesh);
            physicsWorld.addRigidBody(wall1.body);

            pos.set(20.5, 0.5, 0);
            var wall2 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 });
            scene.add(wall2.mesh);
            physicsWorld.addRigidBody(wall2.body);

            pos.set(0, 0.5, -20.5);
            var wall3 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 });
            scene.add(wall3.mesh);
            physicsWorld.addRigidBody(wall3.body);

            pos.set(0, 0.5, 20.5);
            var wall4 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 });
            scene.add(wall4.mesh);
            physicsWorld.addRigidBody(wall4.body);
        }

        return {
            init: init,
            interaction: interaction
        };
    });