define("meshfactory",
    ["three", "ammo"],
    function(THREE) {
        "use strict";

        function Mesh(mesh, shape, body) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh = mesh;
            this.shape = shape;
            this.body = body;
        }

        function PhysicsMesh(mesh, shape, mass, pos, quat) {
            shape.setMargin(this.margin);
            var body = createRigidBody(mesh, shape, mass, pos, quat);

            Mesh.call(this, mesh, shape, body);
        }

        PhysicsMesh.prototype = Object.create(Mesh.prototype);
        PhysicsMesh.constructor = PhysicsMesh;
        PhysicsMesh.prototype.margin = 0.05;

        function BallMesh(pos, quat) {
            var mass = 0.7;
            var radius = 0.4;

            var mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 16), this.material);
            var shape = new Ammo.btSphereShape(radius);

            PhysicsMesh.call(this, mesh, shape, mass, pos, quat);
        }

        BallMesh.prototype = Object.create(PhysicsMesh.prototype);
        BallMesh.constructor = BallMesh;
        BallMesh.prototype.material = new THREE.MeshPhongMaterial({ color: 0x202020 });

        function GroundMesh(options) {
            var sx = 40, sy = 1, sz = 40, mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), this.material);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));

            PhysicsMesh.call(this, mesh, shape, mass, options.pos, options.quat);
        }

        GroundMesh.prototype = Object.create(PhysicsMesh.prototype);
        GroundMesh.constructor = GroundMesh;
        GroundMesh.prototype.material = new THREE.MeshPhongMaterial({ color: 0xffffff });

        function RampMesh(pos, quat) {
            var sx = 10, sy = 1, sz = 4, mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), this.material);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));

            PhysicsMesh.call(this, mesh, shape, mass, pos, quat);
        }

        RampMesh.prototype = Object.create(PhysicsMesh.prototype);
        RampMesh.constructor = RampMesh;
        RampMesh.prototype.material = new THREE.MeshPhongMaterial({ color: 0x606060 });

        function WallMesh(options) {
            var mass = 0;

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(options.sx, options.sy, options.sz, 1, 1, 1),
                this.material);
            var shape = new Ammo.btBoxShape(new Ammo.btVector3(options.sx * 0.5, options.sy * 0.5, options.sz * 0.5));

            PhysicsMesh.call(this, mesh, shape, mass, options.pos, options.quat);
        }

        WallMesh.prototype = Object.create(PhysicsMesh.prototype);
        WallMesh.constructor = WallMesh;
        WallMesh.prototype.material = new THREE.MeshPhongMaterial({ color: 0x606060 });

        function createRigidBody(mesh, physicsShape, mass, pos, quat) {
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
                body.setActivationState(4);
            }

            return body;
        }

        return {
            Ball: BallMesh,
            Ground: GroundMesh,
            Ramp: RampMesh,
            Wall: WallMesh
        };
    });