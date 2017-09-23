define("app",
    [
        "three", "stats", "scene", "renderer", "camera", "clock", "raycaster", "lighting", "controls", "meshfactory",
        "ammo"
    ],
    function(THREE, stats, scene, renderer, camera, clock, raycaster, lightingFactory, controlFactory, meshfactory) {
        "use strict";

        var init, animate;

        Ammo().then(function(Ammo) {

            init = function() {
                initGraphics();
                initPhysics();
                createObjects();
                initInput();
            };

            animate = function() {
                requestAnimationFrame(animate);
                render();
                stats.update();
            };

            var pos = new THREE.Vector3();
            var quat = new THREE.Quaternion();

            var physicsWorld;
            var gravityConstant = -9.8;

            var transformAux1 = new Ammo.btTransform();
            var clickRequest = false;
            var mouseCoords = new THREE.Vector2();
            var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

            var rigidBodies = [];
            var margin = 0.05;


            function initGraphics() {
                var container = document.body;

                camera.position.set(-7, 5, 8);

                var controls = controlFactory.orbitcontrols(camera);
                controls.target.set(0, 2, 0);
                controls.update();

                scene.add(lightingFactory.ambientLight());
                scene.add(lightingFactory.directionalLight());

                container.appendChild(renderer.domElement);

                container.appendChild(stats.dom);

                window.addEventListener("resize", onWindowResize, false);
            };

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
            };

            function createObjects() {
                // ground
                pos.set(0, - 0.5, 0);
                quat.set(0, 0, 0, 1);
//                var ground = createParalellepiped(40,
//                    1,
//                    40,
//                    0,
//                    pos,
//                    quat,
//                    new THREE.MeshPhongMaterial({ color: 0xffffff }));
//                ground.castShadow = true;
//                ground.receiveShadow = true;
                new meshfactory.Ground({ pos: pos, quat: quat }, physicsWorld, rigidBodies, scene);

                pos.set(-20.5, 0.5, 0);
                //createWall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 });
                new meshfactory.Wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, physicsWorld, rigidBodies, scene);

                pos.set(20.5, 0.5, 0);
                //createWall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 });
                new meshfactory.Wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, physicsWorld, rigidBodies, scene);

                pos.set(0, 0.5, -20.5);
                //createWall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 });
                new meshfactory.Wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, physicsWorld, rigidBodies, scene);

                pos.set(0, 0.5, 20.5);
                //createWall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 });
                new meshfactory.Wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, physicsWorld, rigidBodies, scene);

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
            };

            function createWall(options) {
                var mesh = createParalellepiped(options.sx,
                    options.sy,
                    options.sz,
                    0,
                    options.pos,
                    options.quat,
                    new THREE.MeshPhongMaterial({ color: 0x606060 }));
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                return mesh;
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

            function initInput() {
                window.addEventListener("mousedown",
                    function(event) {
                        if (!clickRequest) {
                            mouseCoords.set(
                                (event.clientX / window.innerWidth) * 2 - 1,
                                - (event.clientY / window.innerHeight) * 2 + 1
                            );

                            clickRequest = true;
                        }
                    });
            };

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            function render() {
                var deltaTime = clock.getDelta();
                updatePhsyics(deltaTime);
                processClick();
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

            function processClick() {
                if (clickRequest) {
                    raycaster.setFromCamera(mouseCoords, camera);


                    var ballMass = 0.7;
                    var ballRadius = 0.4;

                    var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial);
                    ball.castShadow = true;
                    ball.receiveShadow = true;
                    var ballShape = new Ammo.btSphereShape(ballRadius);
                    ballShape.setMargin(margin);
                    pos.copy(raycaster.ray.direction);
                    pos.add(raycaster.ray.origin);
                    quat.set(0, 0, 0, 1);
                    var ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);
                    ballBody.setFriction(0.5);

                    pos.copy(raycaster.ray.direction);
                    pos.multiplyScalar(14);
                    ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));

                    clickRequest = false;
                }
            }
        });


        return {
            init: init,
            animate: animate
        };
    });