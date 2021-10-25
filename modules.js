'use_strict';

class ARModule {
    constructor() {
        this.node = new THREE.Object3D();
        this.node.matrixAutoUpdate = false;
        this.node.visible = false;
        this.wasVisible = false;
        this.markerMatrix = new Float64Array(12);
        this.link = new THREE.Mesh();
        this.posToConnect = new THREE.Vector3();
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

    distanceOf(m1, m2) {
        let wp1 = new THREE.Vector3();
        let wp2 = new THREE.Vector3();
        m1.node.getWorldPosition(wp1);
        m2.node.getWorldPosition(wp2);
        return Math.sqrt((Math.pow(wp1.x, 2) - Math.pow(wp2.x, 2)) + (Math.pow(wp1.y, 2) - Math.pow(wp2.y, 2)) + (Math.pow(wp1.z, 2) - Math.pow(wp2.z, 2)));
    }

    process(modules, threshold, centerPos) {
        if (this.node.visible) {
            let linkedUp = false;
            let dstTemp = threshold + 1;
            for (const id in modules) {
                if (id !== this.id.toString()) {
                    const m = modules[id];
                    const dstToMod = this.distanceOf(m, this);
                    if (dstToMod <= threshold && dstToMod < dstTemp) {
                        if (this.canConnectToModule(m)) {
                            m.node.getWorldPosition(this.posToConnect);
                            dstTemp = dstToMod;
                            linkedUp = true;
                        }
                    }
                }
            }
            if (this.canConnectToCenter() && !linkedUp) {
                this.posToConnect.copy(centerPos);
            }
            this.updateLink();
        }

        if (!this.wasVisible) {
            this.to = setTimeout((function () {
                this.node.visible = false;
                this.link.visible = false;
            }).bind(this), 500);

        } else {
            this.link.visible = true;
            this.node.visible = true;
            clearTimeout(this.to);
        }
        this.wasVisible = false;
    }

    updateLink() {
        let pos = new THREE.Vector3();
        this.node.getWorldPosition(pos);
        this.link.geometry = new THREE.TubeGeometry(new THREE.LineCurve3(this.posToConnect, pos), 20, 0.2, 10);
        this.link.material = new THREE.MeshBasicMaterial({color: 0xb73acd});
    }

}

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
        this.node.add(cube);
    };

    canConnectToCenter() {
        return true;
    };

    canConnectToModule(mod) {
        return mod instanceof EffectModule;
    }
}

class EffectModule extends ARModule {
    constructor() {
        super();
        this.node.matrixAutoUpdate = false;
        this.node.visible = true;
        this.wasVisible = true;
        this.markerMatrix = new Float64Array(12);

        const geometry = new THREE.TorusKnotGeometry(0.4, 0.1, 25, 8, 2, 3);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        const torusKnot = new THREE.Mesh(geometry, material);
        this.node.add(torusKnot);
    };

    canConnectToCenter() {
        return true;
    };

    canConnectToModule(mod) {
        return mod instanceof EffectModule;
    };

}

class ControlModule extends ARModule {
    constructor() {
        super();
        this.node.matrixAutoUpdate = false;
        this.node.visible = true;
        this.wasVisible = true;
        this.markerMatrix = new Float64Array(12);

        const geometry = new THREE.TorusGeometry(0.5, 0.2, 8, 18, 6.3);
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const torus = new THREE.Mesh(geometry, material);
        this.node.add(torus);
    };

    canConnectToCenter() {
        return false;
    };

    canConnectToModule(mod) {
        return true;
    }

}


