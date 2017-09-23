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
            var softBodies = [];
            var margin = 0.05;
            var transformAux1 = new Ammo.btTransform();
            var softBodyHelpers = new Ammo.btSoftBodyHelpers();

            //var transformAux1 = new Ammo.btTransform();

            var cube;

            var createCube = function(geometry, material) {
                return new THREE.Mesh(geometry, material);
            };

            function init() {

                initGraphics();
                initPhysics();
                createObjects();
                initInput();
//                var geometry = new THREE.BoxGeometry(1, 1, 1);
//                var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
//
//                cube = createCube(geometry, material);
//                var cube2 = createCube(geometry, material);
//                cube2.position.set(1, 1, 1);
//
//                scene.add(cube);
//                scene.add(cube2);


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
                var volumeMass = 15;

                var sphereGeometry = new THREE.SphereBufferGeometry(1.5, 40, 25);
                sphereGeometry.translate(-2, 5, 0);
                createSoftVolume(sphereGeometry, volumeMass, 250);

                var boxGeometry = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(1, 1, 5, 4, 4, 20));
                boxGeometry.translate(-2, 5, 0);
                createSoftVolume(boxGeometry, volumeMass, 120);

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

            function createSoftVolume(bufferGeometry, mass, pressure) {
                processGeometry(bufferGeometry);

                var mesh = new THREE.Mesh(bufferGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = false;
                scene.add(mesh);

                var meshSoftBody = softBodyHelpers.CreateFromTriMesh(
                    physicsWorld.getWorldInfo(),
                    bufferGeometry.ammoVertices,
                    bufferGeometry.ammoIndices,
                    bufferGeometry.ammoIndices.length / 3,
                    true
                );

                var meshSoftBodyConfig = meshSoftBody.get_m_cfg();
                meshSoftBodyConfig.set_viterations(40);
                meshSoftBodyConfig.set_piterations(40);

                meshSoftBodyConfig.set_collisions(0x11);
                meshSoftBodyConfig.set_kDF(0.1);
                meshSoftBodyConfig.set_kDP(0.01);
                meshSoftBodyConfig.set_kPR(pressure);

                meshSoftBody.get_m_materials().at(0).set_m_kLST(0.9);
                meshSoftBody.get_m_materials().at(0).set_m_kAST(0.9);

                meshSoftBody.setTotalMass(mass, false);
                Ammo.castObject(meshSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin);
                physicsWorld.addSoftBody(meshSoftBody, 1, -1);
                meshSoftBody.setActivationState(4);
                softBodies.push(mesh);
            }

            function processGeometry(bufferGeometry) {
                var geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
                var vertsDiff = geometry.mergeVertices();
                var indexedBufferGeometry = createIndexedBufferGeometryFromGeometry(geometry);
                mapIndices(bufferGeometry, indexedBufferGeometry);
            }

            function createIndexedBufferGeometryFromGeometry(geometry) {
                var numVertices = geometry.vertices.length;
                var numFaces = geometry.faces.length;

                var bufferedGeometry = new THREE.BufferGeometry();
                var vertices = new Float32Array(numVertices * 3);
                var indices = new (numFaces * 3 > 65535 ? Uint32Array : Uint16Array)(numFaces * 3);

                for (var i = 0; i < numVertices; i++) {
                    var p = geometry.vertices[i];
                    var i3 = i * 3;
                    vertices[i3] = p.x;
                    vertices[i3 + 1] = p.y;
                    vertices[i3 + 2] = p.z;
                }

                for (var i = 0; i < numFaces; i++) {
                    var f = geometry.faces[i];
                    var i3 = i * 3;
                    indices[i3] = f.a;
                    indices[i3 + 1] = f.b;
                    indices[i3 + 2] = f.c;
                }

                bufferedGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
                bufferedGeometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));

                return bufferedGeometry;
            }

            function mapIndices(bufferGeometry, indexedBufferGeometry) {
                var vertices = bufferGeometry.attributes.position.array;
                var idxVertices = indexedBufferGeometry.attributes.position.array;
                var indices = indexedBufferGeometry.index.array;

                var numIdxVertices = idxVertices.length / 3;
                var numVertices = vertices.length / 3;

                bufferGeometry.ammoVertices = idxVertices;
                bufferGeometry.ammoIndices = indices;
                bufferGeometry.ammoIndexAssociation = [];

                for (var i = 0; i < numIdxVertices; i++) {
                    var association = [];
                    bufferGeometry.ammoIndexAssociation.push(association);

                    var i3 = i * 3;

                    for (var j = 0; j < numVertices; j++) {
                        var j3 = j * 3;
                        if (isEqual(idxVertices[i3],
                            idxVertices[i3 + 1],
                            idxVertices[i3 + 2],
                            vertices[j3],
                            vertices[j3 + 1],
                            vertices[j3 + 2])) {
                            association.push(j3);
                        }

                    }
                }
            }

            function isEqual(x1, y1, z1, x2, y2, z2) {
                var delta = 0.000001;
                return Math.abs(x2 - x1) < delta && Math.abs(y2 - y1) < delta && Math.abs(z2 - z1);
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
                controls.update(clock.getDelta());
                renderer.render(scene, camera);
            }

            init();
            animate();
        });


    });