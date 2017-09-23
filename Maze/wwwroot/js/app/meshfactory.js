define("meshfactory",
    ["three", "ammo"],
    function(THREE) {
        "use static";
        var margin = 0.05;

        var wallMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
        var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
        var rampMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });

        function Ball(pos, quat, physicsWorld, rigidBodies, scene) {
            var ballMass = 0.7;
            var ballRadius = 0.4;

            this.mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.ballShape = new Ammo.btSphereShape(ballRadius);
            this.ballShape.setMargin(margin);
            this.ballBody = createRigidBody(this.mesh, this.ballShape, ballMass, pos, quat, physicsWorld, rigidBodies, scene);
            this.ballBody.setFriction(0.5);
        };

        function Ground(options, physicsWorld, rigidBodies, scene) {
            this.mesh = createParalellepiped(40,
                1,
                40,
                0,
                options.pos,
                options.quat,
                groundMaterial,
                physicsWorld,
                rigidBodies,
                scene);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        }

        function Ramp(pos, quat, physicsWorld, rigidBodies, scene) {
            this.mesh = createParalellepiped(10,
                1,
                4,
                0,
                pos,
                quat,
                rampMaterial,
                physicsWorld, rigidBodies, scene);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
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

            //scene.add(mesh);

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
            Ramp: Ramp,
            Wall: Wall
        };
    });