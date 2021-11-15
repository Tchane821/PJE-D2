'use_strict';


//window.ARThreeOnLoad = function() {
let ARThreeOnLoad = function () {
    console.log("Loading ARThree");

    let arController = new ARController(640, 360, 'lib/camera_para.dat');

    //Choose source here
    arController.onload = function () {

        //Uncomment and set video file (ogg, mp4, webm)
        //loadVideo("data/video.webm", arController, start);

        //Uncomment to use camera
        loadCamera(arController, start);
    };


    function start(video) {
        console.log("Initializing");

        //Initialize ARToolkit and Three
        let renderer = new THREE.WebGLRenderer({antialias: true});
        initializeRenderer(arController, renderer);

        //Create video plane and scene
        let videoTex = new THREE.Texture(video);
        videoTex.minFilter = THREE.LinearFilter;
        videoTex.flipY = false;
        let plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2, 2),
            new THREE.MeshBasicMaterial({map: videoTex, side: THREE.DoubleSide})
        );
        plane.material.depthTest = false;
        plane.material.depthWrite = false;
        let videoCamera = new THREE.OrthographicCamera(-1, 1, -1, 1, -1, 1);
        let videoScene = new THREE.Scene();
        videoScene.add(plane);
        videoScene.add(videoCamera);
        if (this.orientation === 'portrait') {
            plane.rotation.z = Math.PI / 2;
        }

        //Create main scene
        let scene = new THREE.Scene();
        let camera = new THREE.Camera();
        camera.matrixAutoUpdate = false;
        camera.projectionMatrix.fromArray(arController.getCameraMatrix());
        scene.add(camera);

        //******************Set constants here ***************************
        const distanceThreshold = 8;
        const markerWidth = 1;
        const centerPos = new THREE.Vector3(0, 0, -10);

        //*******************Code for modules management here ***********
        let modules = {};

        let addModule = function (markerID, markerModule) {
            markerModule.setID(markerID);
            scene.add(markerModule.node);
            scene.add(markerModule.link);
            modules[markerID] = markerModule;
        };


        //******************Add your modules here************************

        // Start Tone
        Tone.Transport.start();

        const geometry = new THREE.SphereGeometry(0.7, 15, 10);
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(centerPos);
        scene.add(sphere);

        addModule(2, new MelodyModule());
        addModule(0, new FilterDist());
        //addModule(0, new ControlModule());
        //addModule(2, new EffectModule());

        //*******************Complete loop function***********************
        let tick = function () {

            //Detect markers
            arController.detectMarker(video);

            //For each marker, test if it corresponds to a module
            let nbMarkers = arController.getMarkerNum();
            for (let mk = 0; mk < nbMarkers; mk++) {
                let markerInfo = arController.getMarker(mk);
                if (modules[markerInfo.idMatrix] != null) {
                    modules[markerInfo.idMatrix]
                        .updateMarkerMatrix(arController, mk, markerWidth);
                }
            }

            //Process modules
            for (let m in modules) {
                modules[m].process(modules, distanceThreshold, centerPos);
            }


            //Render everything
            videoTex.needsUpdate = true;
            let ac = renderer.autoClear;
            renderer.autoClear = false;
            renderer.clear();
            renderer.render(videoScene, videoCamera);
            renderer.render(scene, camera);
            renderer.autoClear = ac;

            //Ask for next frame
            requestAnimationFrame(tick);
        };

        console.log("Starting loop");
        tick();
    }

};

//Start everything when the webassembly has been loaded
window.addEventListener('artoolkit-loaded', () => {
    ARThreeOnLoad();
});

