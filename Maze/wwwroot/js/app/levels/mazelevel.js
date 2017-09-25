﻿define("mazelevel",
    ["three", "meshfactory", "jquery", "datgui"],
    function(THREE, meshfactory, $, dat) {
        "use strict";

        var manual = "manual", automatic = "automatic";
        var leftArrow = 37, rightArrow = 39, upArrow = 38, downArrow = 40;

        var player, camera, gui, speed = 5;
        var maze;
        var keyRequest = false, keyCode;
        var controlMode = manual, solution = undefined;
        var pos = new THREE.Vector3(), quat = new THREE.Quaternion();

        function init(options) {
            camera = options.camera;

            downloadMaze(function(data) {
                maze = data;
                createGround(maze.map, options.scene, options.physicsWorld);
                createWalls(maze.map, options.scene, options.physicsWorld);
                createGoal(maze.map, options.scene);
                player = createBall(maze.map, options.scene, options.physicsWorld, options.rigidBodies);
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

        function downloadSolution(player, map, success) {
            var currentLocation = player.mesh.position;

            $.ajax({
                async: true,
                data: {
                    width: maze.width,
                    height: maze.height,
                    seed: maze.seed,
                    x: translateFromOrigin(currentLocation.x, map[0].length),
                    z: translateFromOrigin(currentLocation.z, map.length)
                },
                method: "GET",
                success: success,
                url: "/Maze/Solve"
            });
        }

        function createGround(map, scene, physicsWorld) {
            pos.set(0, -0.5, 0);
            quat.set(0, 0, 0, 1);
            var ground = new meshfactory.Ground({ pos: pos, quat: quat, sx: map[0].length, sy: 0.5, sz: map.length });
            scene.add(ground.mesh);
            physicsWorld.addRigidBody(ground.body);
        }

        function createWalls(map, scene, physicsWorld) {
            for (var z = 0, zl = map.length; z < zl; z++) {
                for (var x = 0, xl = map[x].length; x < xl; x++) {
                    if (map[z][x] === "w") {
                        quat.set(0, 0, 0, 1);
                        translateToOrigin(x, 0.5, z, xl, zl);
                        var wall = new meshfactory.Wall({ pos: pos, quat: quat, sx: 0.8, sy: 0.8, sz: 0.8 });
                        scene.add(wall.mesh);
                        physicsWorld.addRigidBody(wall.body);
                    }
                }
            }
        }

        function createGoal(map, scene) {
            for (var z = 0, zl = map.length; z < zl; z++) {
                for (var x = 0, xl = map[x].length; x < xl; x++) {
                    if (map[z][x] === "g") {
                        quat.set(0, 0, 0, 1);
                        translateToOrigin(x, 0, z, xl, zl);
                        var slab = new meshfactory.Slab({ pos: pos, quat: quat, sx: 0.8, sy: 0.1, sz: 0.8 });
                        scene.add(slab.mesh);
                        return;
                    }
                }
            }
        }

        function createBall(map, scene, physicsWorld, rigidBodies) {
            for (var z = 0, zl = map.length; z < zl; z++) {
                for (var x = 0, xl = map[x].length; x < xl; x++) {
                    if (map[z][x] === "s") {
                        quat.set(0, 0, 0, 1);
                        translateToOrigin(x, 0, z, xl, zl);
                        var ball = new meshfactory.Ball({ pos: pos, quat: quat });
                        scene.add(ball.mesh);
                        physicsWorld.addRigidBody(ball.body);
                        rigidBodies.push(ball.mesh);
                        return ball;
                    }
                }
            }
        }

        function translateToOrigin(x, y, z, width, height) {
            pos.set(x - (width / 2) + 0.5, y, z - (height / 2) + 0.5);
        }

        function translateFromOrigin(value, limit) {
            return Math.floor(value + (limit / 2) - 0.5);
        }

        function initGui() {
            var controller = {
                manual: function() {
                    controlMode = manual;
                },
                automatic: function() {
                    controlMode = automatic;
                    downloadSolution(player,
                        maze.map,
                        function(data) {
                            solution = data;
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
            if (controlMode === manual && keyRequest === true) {
                manualControl(player, keyCode);
            } else if (controlMode === automatic && solution !== undefined && solution.length === 0) {
                releaseAutomaticControl();
            } else if (controlMode === automatic && solution !== undefined) {
                automaticControl(player, maze.map);
            }
        }

        function manualControl(player) {
            var linearVelocity = player.body.getLinearVelocity();

            switch (keyCode) {
            case leftArrow:
                player.body.setLinearVelocity(new Ammo.btVector3(-speed, 0, linearVelocity.z()));
                break;
            case rightArrow:
                player.body.setLinearVelocity(new Ammo.btVector3(speed, 0, linearVelocity.z()));
                break;
            case upArrow:
                player.body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x(), 0, -speed));
                break;
            case downArrow:
                player.body.setLinearVelocity(new Ammo.btVector3(linearVelocity.x(), 0, speed));
                break;
            }

            keyRequest = false;
        }

        function releaseAutomaticControl() {
            controlMode = manual;
            solution = undefined;
            player.body.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
        }

        function automaticControl(player, map) {
            var currentLocation = player.mesh.position;
            var currentX = translateFromOrigin(Math.floor(currentLocation.x), map[0].length);
            var currentZ = translateFromOrigin(Math.floor(currentLocation.z), map.length);
            var targetX = solution[0].x;
            var targetZ = solution[0].z;

            if (currentX === targetX && currentZ === targetZ) {
                solution.splice(0, 1);
                if (solution.length === 0) {
                    return;
                }
                targetX = solution[0].x;
                targetZ = solution[0].z;
            }

            var linearVelocity = player.body.getLinearVelocity();
            var velocityX = linearVelocity.x();
            var velocityZ = linearVelocity.z();

            if (targetX < currentX) {
                velocityX = -speed;
            }
            if (targetX > currentX) {
                velocityX = speed;
            }
            if (targetZ < currentZ) {
                velocityZ = -speed;
            }
            if (targetZ > currentZ) {
                velocityZ = speed;
            }

            player.body.setLinearVelocity(new Ammo.btVector3(velocityX, 0, velocityZ));
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