define("meshfactory",
    ["three", "ammo"],
    function(THREE) {
        "use static";
        var margin = 0.05;

        var wallMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
        var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

        function Ball() {

        };

        function Ground(options, physicsWorld, rigidBodies, scene) {
            this.ground = createParalellepiped(40,
                1,
                40,
                0,
                options.pos,
                options.quat,
                groundMaterial,
                physicsWorld,
                rigidBodies,
                scene);
            this.ground.castShadow = true;
            this.ground.receiveShadow = true;
        }

        function Wall(options, physicsWorld, rigidBodies, scene) {
            this.mesh = createParalellepiped(options.sx,
                options.sy,
                options.sz,
                0,
                options.pos,
                options.quat,
                wallMaterial,
                physicsWorld,
                rigidBodies,
                scene);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        };

        function createParalellepiped(sx, sy, sz, mass, pos, quat, material, physicsWorld, rigidBodies, scene) {
            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            createRigidBody(mesh, shape, mass, pos, quat, physicsWorld, rigidBodies, scene);

            return mesh;
        }

        function createRigidBody(mesh, physicsShape, mass, pos, quat, physicsWorld, rigidBodies, scene) {
            mesh.position.copy(pos);
            mesh.quaternion.copy(quat);

            var transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
            var motionState = new Ammo.btDefaultMotionState(transform);

            var localInertia = new Ammo.btVector3(0, 0, 0);
            physicsShape.calculateLocalInertia(mass, localInertia);

            var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
            var body = new Ammo.btRigidBody(rbInfo);

            mesh.userData.physicsBody = body;

            scene.add(mesh);

            if (mass > 0) {
                rigidBodies.push(mesh);

                body.setActivationState(4);
            }

            physicsWorld.addRigidBody(body);
            return body;
        }

        return {
            Ball: Ball,
            Ground: Ground,
            Wall: Wall
        };
    });