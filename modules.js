'use_strict';

class ARModule {
    constructor() {
        this.node = new THREE.Object3D();
        this.node.matrixAutoUpdate = false;
        this.node.visible = false;
        this.wasVisible = false;
        this.markerMatrix = new Float64Array(12);
    };

    setID(id) {
        this.id = id;
    };

    canConnectToModule(mod) {
        return false;
    };

    canConnectToCenter() {
        return true;
    };

    updateMarkerMatrix(arController, mk, markerWidth) {
        if (this.node.visible) {
            arController.getTransMatSquareCont(mk, markerWidth,
                this.markerMatrix,
                this.markerMatrix);
        } else {
            arController.getTransMatSquare(mk, markerWidth,
                this.markerMatrix);
        }
        arController.arglCameraViewRHf(
            arController.transMatToGLMat(this.markerMatrix),
            this.node.matrix.elements);

        this.node.visible = true;
        this.wasVisible = true;
    };

    process(modules, threshold, centerPos) {
        if (this.node.visible) {
            //*****Add code to test connection with other modules*********


        }


        if (!this.wasVisible) {
            this.node.visible = false;
            this.link.visible = false;
        }
        this.wasVisible = false;
    };
};

class SourceModule extends ARModule {
    constructor() {
        super();
        this.node.matrixAutoUpdate = false;
        this.node.visible = true;
        this.wasVisible = true;
        this.markerMatrix = new Float64Array(12);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        this.node.children.add(cube);
    };
}

class EffectModule extends ARModule {
    constructor() {
        super();
        this.node.matrixAutoUpdate = false;
        this.node.visible = true;
        this.wasVisible = true;
        this.markerMatrix = new Float64Array(12);

        const geometry = new THREE.TorusKnotGeometry(8, 3, 65, 8, 2, 3);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00});
        const torusKnot = new THREE.Mesh(geometry, material);
        this.node.children.add(torusKnot);
    };
}

class ControlModule extends ARModule {
    constructor() {
        super();
        this.node.matrixAutoUpdate = false;
        this.node.visible = true;
        this.wasVisible = true;
        this.markerMatrix = new Float64Array(12);

        const geometry = new THREE.TorusGeometry(6, 3, 10, 21, 6.3);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00});
        const torus = new THREE.Mesh(geometry, material);
        this.node.children.add(torus);
    };
}


