define("mazelevel",
    ["three", "meshfactory", "jquery", "datgui"],
    function(THREE, meshfactory, $, dat) {
        "use strict";

        var player;
        var camera;
        var gui;

        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();

        var maze, map;

        var keyRequest = false;
        var keyCode;

        var mode = "manual";
        var solution;

        function init(options) {
            camera = options.camera;

            downloadMaze(function(data) {
                maze = data;
                map = data.map;

                ground(options.scene, options.physicsWorld);
                walls(map, options.scene, options.physicsWorld);
                ball(options.scene, options.physicsWorld, options.rigidBodies);
                initGui();
                initInput();
            });
        }

        function interaction(scene, physicsWorld, rigidBodies, raycaster) {

        }

        function render() {
            handleKeyboard();
            handleCamera();
        }

        function downloadMaze(success) {
            $.ajax({
                async: true,
                method: "GET",
                success: success,
                url: "/Maze/Generate"
            });
        }

        function downloadSolution(success) {
            var currentLocation = player.mesh.position;

            function translate(value, limit) {
                return Math.floor(value + (limit / 2) - 0.5);
            }

            $.ajax({
                async: true,
                data: {
                    width: maze.width,
                    height: maze.height,
                    seed: maze.seed,
                    x: translate(currentLocation.x, map[0].length),
                    z: translate(currentLocation.z, map.length)
                },
                method: "GET",
                success: success,
                url: "/Maze/Solve"
            });
        }

        function ground(scene, physicsWorld) {
            pos.set(0, -0.5, 0);
            quat.set(0, 0, 0, 1);
            var ground = new meshfactory.Ground({ pos: pos, quat: quat, sx: map[0].length, sy: 0.5, sz: map.length });
            scene.add(ground.mesh);
            physicsWorld.addRigidBody(ground.body);
        }

        function walls(map, scene, physicsWorld) {
            function translate(x, y, z, width, height) {
                pos.set(x - (width / 2) + 0.5, y, z - (height / 2) + 0.5);
            }

            for (var z = 0, zl = map.length; z < zl; z++) {
                for (var x = 0, xl = map[x].length; x < xl; x++) {
                    if (map[z][x] === "w") {
                        quat.set(0, 0, 0, 1);
                        translate(x, 0.5, z, xl, zl);
                        wall({ pos: pos, quat: quat, sx: 0.8, sy: 0.8, sz: 0.8 }, scene, physicsWorld);
                    }
                }
            }
        }

        function wall(options, scene, physicsWorld) {
            var wall = new meshfactory.Wall(options);
            scene.add(wall.mesh);
            physicsWorld.addRigidBody(wall.body);
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

        function initGui() {
            var controller = {
                manual: function() {
                    mode = "manual";
                },
                automatic: function() {
                    mode = "automatic";
                    downloadSolution(function(data) {
                        solution = data;
                        console.log(solution);
                    });
                }
            };

            gui = new dat.GUI();

            var h = gui.addFolder("Solve");

            h.add(controller, "manual").name("manual");
            h.add(controller, "automatic").name("automatic");
        }

        function initInput() {
            window.addEventListener("keydown",
                function(event) {
                    if (keyRequest === false) {
                        keyRequest = true;
                        keyCode = event.keyCode;
                    }
                },
                false);
        }

        function handleKeyboard() {
            if (mode === "manual" && keyRequest === true) {
                var speed = 5;

                var linearVelocity = player.body.getLinearVelocity();

                switch (keyCode) {
                case 37: // left arrow
                    player.body.setLinearVelocity(new Ammo.btVector3(-speed, 0, linearVelocity.z()));
                    break;
                case 39: // right arrow
                    player.body.setLinearVelocity(new Ammo.btVector3(speed, 0, linearVelocity.z()));
                    break;
                case 38: // up arrow
                    player.body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x(), 0, -speed));
                    break;
                case 40: // down arrow
                    player.body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x(), 0, speed));
                    break;
                }

                keyRequest = false;
            }
            if (mode === "automatic") {

            }
        }

        function handleCamera() {
            if (player !== undefined) {
                var playerPosition = player.mesh.position;
                camera.position.set(playerPosition.x + 2, 15, playerPosition.z + 6);

                camera.lookAt(player.mesh.position);
            }
        }

        return {
            init: init,
            interaction: interaction,
            render: render
        };
    });