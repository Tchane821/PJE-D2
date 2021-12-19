'use_strict';

let modSelected = null;
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


        // ***** Gestion pointer *****
        function onPointerDown(event) {
            const valX = event.pageX;
            const valY = event.pageY;
            const rect = renderer.domElement.getBoundingClientRect(); //(rect.x, rect.y) et (rect.width, rect.height)
            const coordCentre = new THREE.Vector2(rect.x + rect.width / 2, rect.y + rect.height / 2);
            const px = (valX - coordCentre.x) / (rect.width / 2) * -1;
            const py = (valY - coordCentre.y) / (rect.height / 2) * -1;
            const pointer = new THREE.Vector2(px, py);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(pointer, camera);
            let intersects = raycaster.intersectObjects(scene.children, true);
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.userData.audioNode != null && intersects[i].object.userData.node.visible) {
                    modSelected = intersects[i].object.userData;
                    console.log("id select : ", intersects[i].object.userData.id);
                    displayConfig();
                }
            }
        }

        function displayConfig() {
            if (modSelected.node.visible) {
                let config = document.getElementById("config");
                config.innerHTML = '';
                for (let q = 0; q < modSelected.parameter.length; q++) {
                    let line = document.createElement('li');
                    let txt = `<p style="width: 45%; display: inline-block">${modSelected.parameter[q]}</p> <select onchange=modifMapping(value,name) style="width: 40%" name=${modSelected.parameter[q]} id="movemap">`;
                    txt += "<option value=''>-- None --</option>";
                    for (let k = 0; k < modSelected.mappingsChoice.length; k++) {
                        if (modSelected.mappings[modSelected.mappingsChoice[k]] === modSelected.parameter[q]) {
                            txt += `<option selected="selected" value="${modSelected.mappingsChoice[k]}">${modSelected.mappingsChoice[k]}</option>`;
                        } else {
                            txt += `<option value="${modSelected.mappingsChoice[k]}">${modSelected.mappingsChoice[k]}</option>`;
                        }
                    }
                    txt += "</select>";
                    line.innerHTML = txt;
                    config.append(line);
                }
            }
        }


        window.addEventListener('pointerdown', onPointerDown, false);

        //Create main scene
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera();
        camera.matrixAutoUpdate = false;
        camera.projectionMatrix.fromArray(arController.getCameraMatrix());
        scene.add(camera);

        //******************Set constants here ***************************
        const distanceThreshold = 3;
        const markerWidth = 1;
        const centerPos = new THREE.Vector3(0, 0, -13);

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
        addModule(1, new DrumsModule());
        addModule(3, new DelayModule());
        addModule(4, new LfoModule());

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
                modules[m].debugPrint();
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

function modifMapping(val, name) {
    for (const mapV in modSelected.mappings) {
        if (modSelected.mappings[mapV] === name) {
            modSelected.mappings[mapV] = "";
        }
    }
    if (val !== "") {
        modSelected.mappings[val] = name;
    }
    console.log(name,"->",val);
}

//Start everything when the webassembly has been loaded
window.addEventListener('artoolkit-loaded', () => {
    ARThreeOnLoad();
});

