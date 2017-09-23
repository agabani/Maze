define("app",
    [
        "three", "stats", "scene", "renderer", "camera", "clock", "raycaster", "lighting", "controls",
        "sandboxlevel", "ammo"
    ],
    function(THREE,
        stats,
        scene,
        renderer,
        camera,
        clock,
        raycaster,
        lightingFactory,
        controlFactory,
        level) {
        "use strict";

        var init, animate;

        Ammo().then(function(Ammo) {
            var physicsWorld;

            var transformAux1 = new Ammo.btTransform();
            var clickRequest = false;
            var mouseCoords = new THREE.Vector2();

            var rigidBodies = [];

            init = function() {
                initGraphics();
                initPhysics();
                level.init(scene, physicsWorld, rigidBodies);
                initInput();
            };

            animate = function() {
                requestAnimationFrame(animate);
                render();
                stats.update();
            };

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
                var gravityConstant = -9.8;
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

                    level.interaction(scene, physicsWorld, rigidBodies, raycaster);

                    clickRequest = false;
                }
            }
        });

        return {
            init: init,
            animate: animate
        };
    });