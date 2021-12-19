class DelayModule extends EffectModule {


    constructor() {
        super();
        const geometry = new THREE.DodecahedronGeometry(0.8, 0);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.mesh = new THREE.Mesh(geometry, material);
        this.node.add(this.mesh);
        this.delay = new Tone.FeedbackDelay("2n", 0.5);
        this.audioNode = this.delay;
        this.outputAudioNode = this.delay;
        this.parameter = ["DelayTime", "FeedBack"];
        this.mappings.ROT_Z = "DelayTime";
        this.mappings.ROT_X = "FeedBack";
    }

    setAudioParameter(parameterName, value) {

        if (parameterName === "DelayTime") {
            const val = (Math.round(value * 14) + 2).toString() + "n";
            this.dt = val;
            this.delay.set({delayTime: val});
        }
        if (parameterName === "FeedBack") {
            const val = value * 0.6;
            this.fb = val;
            this.delay.set({feedback: val});
        }
    }

    debugPrint() {
        let wp1 = new THREE.Vector3();
        this.node.getWorldPosition(wp1);
        let dst = this.distanceWp(wp1, this.posToConnect);
        this.debugMark.innerHTML = `Name: DelayM delayT: ${this.dt}    feedBack: ${this.fb}    Id: ${this.id}  Visible: ${this.node.visible}   DistanceToConnect: ${dst}`;
    }


}