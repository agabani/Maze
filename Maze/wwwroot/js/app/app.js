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

            var rigidBodies = [];


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
                pos.set(0, - 0.5, 0);
                quat.set(0, 0, 0, 1);
                var ground = new meshfactory.Ground({ pos: pos, quat: quat }, rigidBodies);
                scene.add(ground.mesh);
                physicsWorld.addRigidBody(ground.body);

                pos.set(-20.5, 0.5, 0);
                var wall1 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, rigidBodies);
                scene.add(wall1.mesh);
                physicsWorld.addRigidBody(wall1.body);

                pos.set(20.5, 0.5, 0);
                var wall2 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, rigidBodies);
                scene.add(wall2.mesh);
                physicsWorld.addRigidBody(wall2.body);

                pos.set(0, 0.5, -20.5);
                var wall3 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, rigidBodies);
                scene.add(wall3.mesh);
                physicsWorld.addRigidBody(wall3.body);

                pos.set(0, 0.5, 20.5);
                var wall4 = new meshfactory.Wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, rigidBodies);
                scene.add(wall4.mesh);
                physicsWorld.addRigidBody(wall4.body);

                pos.set(5, 10, 0);
                quat.set(0, 0, 0, 1);
                var ball = new meshfactory.Ball(pos, quat, rigidBodies);
                scene.add(ball.mesh);
                physicsWorld.addRigidBody(ball.body);

                pos.set(3, 1, 0);
                quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 30 * Math.PI / 180);
                var ramp = new meshfactory.Ramp(pos, quat, rigidBodies);
                scene.add(ramp.mesh);
                physicsWorld.addRigidBody(ramp.body);
            };

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

                    pos.copy(raycaster.ray.direction);
                    pos.add(raycaster.ray.origin);
                    quat.set(0, 0, 0, 1);

                    var mesh = new meshfactory.Ball(pos, quat, rigidBodies);
                    scene.add(mesh.mesh);
                    physicsWorld.addRigidBody(mesh.body);

                    pos.copy(raycaster.ray.direction);
                    pos.multiplyScalar(14);
                    mesh.body.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));

                    clickRequest = false;
                }
            }
        });


        return {
            init: init,
            animate: animate
        };
    });