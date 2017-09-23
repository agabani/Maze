define("meshfactory",
    ["three", "ammo"],
    function(THREE) {
        "use static";
        var margin = 0.05;

        var wallMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
        var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
        var rampMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });

        function Ball(pos, quat, physicsWorld, rigidBodies) {
            var ballMass = 0.7;
            var ballRadius = 0.4;

            this.mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.ballShape = new Ammo.btSphereShape(ballRadius);
            this.ballShape.setMargin(margin);
            this.ballBody = createRigidBody(this.mesh, this.ballShape, ballMass, pos, quat, physicsWorld, rigidBodies);
            this.ballBody.setFriction(0.5);
        };

        function Ground(options, physicsWorld, rigidBodies) {
            var sx = 40, sy = 1, sz = 40, mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), groundMaterial);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            var body = createRigidBody(mesh, shape, mass, options.pos, options.quat, physicsWorld, rigidBodies);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh = mesh;
            this.shape = shape;
            this.body = body;
        }

        function Ramp(pos, quat, physicsWorld, rigidBodies) {
            var sx = 10, sy = 1, sz = 4, mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), rampMaterial);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            var body = createRigidBody(mesh, shape, mass, pos, quat, physicsWorld, rigidBodies);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh = mesh;
            this.shape = shape;
            this.body = body;
        }

        function Wall(options, physicsWorld, rigidBodies) {
            this.mesh = createParalellepiped(options.sx,
                options.sy,
                options.sz,
                0,
                options.pos,
                options.quat,
                wallMaterial,
                physicsWorld,
                rigidBodies);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        };

        function createParalellepiped(sx, sy, sz, mass, pos, quat, material, physicsWorld, rigidBodies) {
            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            createRigidBody(mesh, shape, mass, pos, quat, physicsWorld, rigidBodies);

            return mesh;
        }

        function createRigidBody(mesh, physicsShape, mass, pos, quat, physicsWorld, rigidBodies) {
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