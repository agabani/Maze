define("mazelevel",
    ["three", "meshfactory"],
    function(THREE, meshfactory) {
        "use strict";

        var player;
        var camera;

        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();

//        var map = [
//            ["w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
//            ["w", " ", "w", " ", " ", " ", "w", " ", " ", " ", "w", " ", " ", " ", " ", " ", "w"],
//            ["w", " ", "w", "w", "w", " ", "w", " ", "w", " ", "w", "w", "w", " ", "w", " ", "w"],
//            ["w", " ", "w", " ", "w", " ", "w", " ", "w", " ", " ", " ", "w", " ", "w", " ", "w"],
//            ["w", " ", "w", " ", "w", " ", "w", " ", "w", "w", "w", " ", "w", " ", "w", "w", "w"],
//            ["w", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w", " ", "w", " ", " ", " ", "w"],
//            ["w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w"],
//            ["w", " ", "w", " ", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w"],
//            ["w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", " ", "w", " ", "w", " ", "w"],
//            ["w", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w", " ", "w", " ", " ", " ", "w"],
//            ["w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", " ", "w"],
//            ["w", " ", "w", " ", "w", " ", "w", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w"],
//            ["w", "w", "w", " ", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w"],
//            ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w", " ", " ", " ", "w"],
//            ["w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w"],
//            ["w", " ", " ", " ", " ", " ", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w"],
//            ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w"]
//        ];

        var map;
        function downloadMap() {
            var httpRequest = new XMLHttpRequest();

            httpRequest.open("GET", "/Maze/Generate", false);
            httpRequest.setRequestHeader("Content-Type", "application/json");
            httpRequest.send();
            var response = JSON.parse(httpRequest.responseText);
            map = response;
        }

        function mazeWalls(map, scene, physicsWorld) {
            function translate(x, y, z, width, height) {
                pos.set(x - (width / 2) + 0.75, y, z - (height / 2) + 0.75);
            }

            for (var z = 0, zl = map.length; z < zl; z++) {
                for (var x = 0, xl = map[x].length; x < xl; x++) {
                    if (map[z][x] === "w") {
                        quat.set(0, 0, 0, 1);
                        //pos.set(x, 0.5, z);
                        translate(x, 0.5, z, xl, zl);
                        wall({ pos: pos, quat: quat, sx: 0.8, sy: 0.8, sz: 0.8 }, scene, physicsWorld);
                    }
                }
            }
        }

        function init(options) {
            camera = options.camera;
            downloadMap();
            ground(options.scene, options.physicsWorld);
            //walls(options.scene, options.physicsWorld);
            mazeWalls(map, options.scene, options.physicsWorld);
            ball(options.scene, options.physicsWorld, options.rigidBodies);
            initInput();
        }

        function interaction(scene, physicsWorld, rigidBodies, raycaster) {

        }

        function render() {
            var playerPosition = player.mesh.position;
            camera.position.set(playerPosition.x + 2, 15, playerPosition.z + 6);

            camera.lookAt(player.mesh.position);
        }

        function initInput() {
            window.addEventListener("keydown",
                function(event) {
                    var speed = 5;

                    var linearVelocity = player.body.getLinearVelocity();

                    switch (event.keyCode) {
                    case 65: // a
                        player.body.setLinearVelocity(new Ammo.btVector3(-speed, 0, linearVelocity.z()));
                        break;
                    case 68: // d
                        player.body.setLinearVelocity(new Ammo.btVector3(speed, 0, linearVelocity.z()));
                        break;
                    case 87: // w
                        player.body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x(), 0, -speed));
                        break;
                    case 83: // s
                        player.body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x(), 0, speed));
                        break;
                    }
                },
                false);
        }

        function ball(scene, physicsWorld, rigidBodies) {
            pos.set(0, 3.5, 0);
            quat.set(0, 0, 0, 1);
            var ball = new meshfactory.Ball({ pos: pos, quat: quat });
            scene.add(ball.mesh);
            physicsWorld.addRigidBody(ball.body);
            rigidBodies.push(ball.mesh);

            player = ball;
        }

        function ground(scene, physicsWorld) {
            pos.set(0, - 0.5, 0);
            quat.set(0, 0, 0, 1);
            var ground = new meshfactory.Ground({ pos: pos, quat: quat, sx: map[0].length, sy: 0.5, sz: map.length });
            scene.add(ground.mesh);
            physicsWorld.addRigidBody(ground.body);
        }

        function walls(scene, physicsWorld) {
            quat.set(0, 0, 0, 1);
            pos.set(-20.5, 0.5, 0);
            wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, scene, physicsWorld);

            pos.set(20.5, 0.5, 0);
            wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 40 }, scene, physicsWorld);

            pos.set(0, 0.5, -20.5);
            wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, scene, physicsWorld);

            pos.set(0, 0.5, 20.5);
            wall({ pos: pos, quat: quat, sx: 40, sy: 1, sz: 1 }, scene, physicsWorld);

            for (var x = -20.5; x < 20.5; x += 2.75) {
                pos.set(x, 0.5, 0);
                wall({ pos: pos, quat: quat, sx: 1, sy: 1, sz: 38 }, scene, physicsWorld);
            }
        }

        function wall(options, scene, physicsWorld) {
            var wall = new meshfactory.Wall(options);
            scene.add(wall.mesh);
            physicsWorld.addRigidBody(wall.body);
        }

        return {
            init: init,
            interaction: interaction,
            render: render
        };
    });