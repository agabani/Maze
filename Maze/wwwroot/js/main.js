requirejs(["three", "stats", "firstpersoncontrols"],
    function(THREE, Stats, firstpersoncontrols) {
        "use strict";

        var container, stats;
        var camera, controls, scene, renderer;
        var clock = new THREE.Clock();

        var cube;

        var createCube = function(geometry, material) {
            return new THREE.Mesh(geometry, material);
        };

        function init() {
            container = document.body;

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000);

            console.log(firstpersoncontrols);
            controls = new THREE.FirstPersonControls(camera);

            controls.movementSpeed = 10;
            controls.lookSpeed = 0.125;
            controls.lookVertical = true;
            controls.constrainVertical = true;
            controls.verticalMin = 1.1;
            controls.verticalMax = 2.2;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            scene.fog = new THREE.FogExp2(0xffffff, 0.00015);

            var ambientLight = new THREE.AmbientLight(0xcccccc);
            scene.add(ambientLight);

            var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
            directionalLight.position.set(1, 1, 0.5).normalize();
            scene.add(directionalLight);

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

            cube = createCube(geometry, material);
            var cube2 = createCube(geometry, material);
            cube2.position.set(1, 1, 1);

            scene.add(cube);
            scene.add(cube2);

            container.appendChild(renderer.domElement);

            stats = new Stats();
            container.appendChild(stats.dom);

            window.addEventListener("resize", onWindowResize, false);
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