class TunnelModule extends ARModule {

    constructor() {
        super();
        const geometry = new THREE.ConeGeometry(0.8, 2, 5)
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.userData = this;
        this.node.add(this.mesh);
    }

    process(modules, threshold, centerPos) {
        if (this.node.visible) {
            //test intersection with the other modules
            for (let m in modules) {
                if (this.id !== modules[m].id && modules[m].node.visible) {

                }
            }
        }
        if (!this.wasVisible) {
            this.node.visible = false;
            this.link.visible = false;
        }
        this.wasVisible = false;
    }


}