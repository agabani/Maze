define("meshfactory",
    ["three", "ammo"],
    function(THREE) {
        "use static";
        var margin = 0.05;

        var wallMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
        var groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
        var rampMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });

        function Ball(pos, quat, rigidBodies) {
            var ballMass = 0.7;
            var ballRadius = 0.4;

            this.mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.ballShape = new Ammo.btSphereShape(ballRadius);
            this.ballShape.setMargin(margin);
            this.body = createRigidBody(this.mesh, this.ballShape, ballMass, pos, quat, rigidBodies);
            this.body.setFriction(0.5);
        };

        function Ground(options, rigidBodies) {
            var sx = 40, sy = 1, sz = 40, mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), groundMaterial);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            var body = createRigidBody(mesh, shape, mass, options.pos, options.quat, rigidBodies);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh = mesh;
            this.shape = shape;
            this.body = body;
        }

        function Ramp(pos, quat, rigidBodies) {
            var sx = 10, sy = 1, sz = 4, mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), rampMaterial);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            var body = createRigidBody(mesh, shape, mass, pos, quat, rigidBodies);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh = mesh;
            this.shape = shape;
            this.body = body;
        }

        function Wall(options, rigidBodies) {
            var mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(options.sx, options.sy, options.sz, 1, 1, 1), wallMaterial);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(options.sx * 0.5, options.sy * 0.5, options.sz * 0.5));
            shape.setMargin(margin);

            var body = createRigidBody(mesh, shape, mass, options.pos, options.quat, rigidBodies);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh = mesh;
            this.shape = shape;
            this.body = body;
        };

        function createRigidBody(mesh, physicsShape, mass, pos, quat, rigidBodies) {
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

            return body;
        }

        return {
            Ball: Ball,
            Ground: Ground,
            Ramp: Ramp,
            Wall: Wall
        };
    });