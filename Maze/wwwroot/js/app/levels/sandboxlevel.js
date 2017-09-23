define("sandboxlevel",
    ["three", "meshfactory"],
    function(THREE, meshfactory) {
        "use strict";

        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();

        function init(scene, physicsWorld, rigidBodies) {
            ground(scene, physicsWorld);
            walls(scene, physicsWorld);
            ramp(scene, physicsWorld);
            ball(scene, physicsWorld, rigidBodies);
        }

        function interaction(scene, physicsWorld, rigidBodies, raycaster) {
            pos.copy(raycaster.ray.direction);
            pos.add(raycaster.ray.origin);
            quat.set(0, 0, 0, 1);

            var ball = new meshfactory.Ball({ pos: pos, quat: quat });
            scene.add(ball.mesh);
            physicsWorld.addRigidBody(ball.body);
            rigidBodies.push(ball.mesh);

            pos.copy(raycaster.ray.direction);
            pos.multiplyScalar(14);
            ball.body.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
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

        function ramp(scene, physicsWorld) {
            pos.set(3, 1, 0);
            quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 30 * Math.PI / 180);
            var ramp = new meshfactory.Ramp(pos, quat);
            scene.add(ramp.mesh);
            physicsWorld.addRigidBody(ramp.body);
        }

        function ball(scene, physicsWorld, rigidBodies) {
            pos.set(5, 10, 0);
            quat.set(0, 0, 0, 1);
            var ball = new meshfactory.Ball({ pos: pos, quat: quat });
            scene.add(ball.mesh);
            physicsWorld.addRigidBody(ball.body);
            rigidBodies.push(ball.mesh);
        }

        return {
            init: init,
            interaction: interaction
        };
    });