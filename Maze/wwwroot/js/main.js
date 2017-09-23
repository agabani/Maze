requirejs(["three", "stats", "ammo", "firstpersoncontrols"],
    function(THREE, Stats) {
        "use strict";

        Ammo().then(function(Ammo) {
            var container, stats;
            var camera, controls, scene, renderer;
            var clock = new THREE.Clock();
            var raycaster = new THREE.Raycaster();
            var pos = new THREE.Vector3();
            var quat = new THREE.Quaternion();

            var gravityConstant = -9.8;
            var physicsWorld;
            var rigidBodies = [];
            var margin = 0.05;
            var transformAux1 = new Ammo.btTransform();

            function init() {

                initGraphics();
                initPhysics();
                createObjects();
                initInput();
            }

            function initGraphics() {
                container = document.body;

                camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.2, 2000);

                scene = new THREE.Scene();
                scene.background = new THREE.Color(0xbfd1e5);
                scene.fog = new THREE.FogExp2(0xffffff, 0.00015);

                camera.position.set(-7, 5, 8);

                controls = new THREE.FirstPersonControls(camera);
                controls.movementSpeed = 10;
                controls.lookSpeed = 0.125;
                controls.lookVertical = true;
                controls.constrainVertical = true;
                controls.verticalMin = 1.1;
                controls.verticalMax = 2.2;

                renderer = new THREE.WebGLRenderer();
                renderer.setClearColor(0xbfd1e5);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;

                var ambientLight = new THREE.AmbientLight(0x404040);
                scene.add(ambientLight);

                var light = new THREE.DirectionalLight(0xffffff, 2);
                light.position.set(1, 1, 0.5).normalize();
                light.castShadow = true;
                var d = 20;
                light.shadow.camera.left = -d;
                light.shadow.camera.right = d;
                light.shadow.camera.top = d;
                light.shadow.camera.bottom = -d;
                light.shadow.camera.near = 2;
                light.shadow.camera.far = 50;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                //light.shadowDarkness = 0.65;
                scene.add(light);

                container.appendChild(renderer.domElement);

                stats = new Stats();
                container.appendChild(stats.dom);

                window.addEventListener("resize", onWindowResize, false);
            }

            function initPhysics() {
                var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
                var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
                var boardphase = new Ammo.btDbvtBroadphase();
                var solver = new Ammo.btSequentialImpulseConstraintSolver();
                var softBodySolver = new Ammo.btDefaultSoftBodySolver();
                physicsWorld =
                    new Ammo.btSoftRigidDynamicsWorld(dispatcher,
                        boardphase,
                        solver,
                        collisionConfiguration,
                        softBodySolver);
                physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
                physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, gravityConstant, 0));
            }

            function createObjects() {
                // ground
                pos.set(0, - 0.5, 0);
                quat.set(0, 0, 0, 1);
                var ground = createParalellepiped(40,
                    1,
                    40,
                    0,
                    pos,
                    quat,
                    new THREE.MeshPhongMaterial({ color: 0xffffff }));
                ground.castShadow = true;
                ground.receiveShadow = true;

                // soft

                var ballMass = 3;
                var ballRadius = 0.4;

                var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16),
                    new THREE.MeshPhongMaterial({ color: 0x202020 }));
                ball.castShadow = true;
                ball.receiveShadow = true;
                var ballShape = new Ammo.btSphereShape(ballRadius);
                ballShape.setMargin(margin);
                pos.set(5, 10, 0);
                quat.set(0, 0, 0, 1);
                var ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);
                ballBody.setFriction(0.5);

                // ramp
                pos.set(3, 1, 0);
                quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 30 * Math.PI / 180);
                var ramp = createParalellepiped(10,
                    1,
                    4,
                    0,
                    pos,
                    quat,
                    new THREE.MeshPhongMaterial({ color: 0x606060 }));
                ramp.castShadow = true;
                ramp.receiveShadow = true;
            }

            function initInput() {
                //
            }

            function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
                var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
                var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
                shape.setMargin(margin);

                createRigidBody(mesh, shape, mass, pos, quat);

                return mesh;
            }

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

                scene.add(mesh);

                if (mass > 0) {
                    rigidBodies.push(mesh);

                    body.setActivationState(4);
                }

                physicsWorld.addRigidBody(body);
                return body;
            }


            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                controls.handleResize();
            }

            function animate() {
                requestAnimationFrame(animate);
                render();
                stats.update();
            }

            function render() {
                var deltaTime = clock.getDelta();
                updatePhsyics(deltaTime);
                controls.update(clock.getDelta());
                renderer.render(scene, camera);
            }

            function updatePhsyics(deltaTime) {
                physicsWorld.stepSimulation(deltaTime, 10);

                for (var i = 0, il = rigidBodies.length; i < il; i++) {
                    var rigidBody = rigidBodies[i];
                    var rigidBodyPhysics = rigidBody.userData.physicsBody;
                    var motionState = rigidBodyPhysics.getMotionState();
                    if (motionState) {
                        motionState.getWorldTransform(transformAux1);
                        var position = transformAux1.getOrigin();
                        var rotation = transformAux1.getRotation();
                        rigidBody.position.set(position.x(), position.y(), position.z());
                        rigidBody.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
                    }
                }
            }

            init();
            animate();
        });


    });