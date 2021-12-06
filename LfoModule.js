class LfoModule extends ControlModule {

    constructor() {
        super();
        this.audioNode = new Tone.LFO("2n", 0, 1).start();

        this.mappings.ROT_Z = "Tempo";
        this.parameter = ["Tempo"];

        this.moduleConnect = null;

    }

    setAudioParameter(parameterName, value) {
        if (parameterName === "Tempo") {
            const val = (Math.round(value * 14) + 2).toString() + "n";
            this.dt = val;
            this.audioNode.set({frequency: val});
        }
    }

    debugPrint() {
        let wp1 = new THREE.Vector3();
        this.node.getWorldPosition(wp1);
        let dst = this.distanceWp(wp1, this.posToConnect);
        this.debugMark.innerHTML = `Name: LFO Tempo : ${this.dt}    value : ${this.meter.getValue() - 0.5}   Id: ${this.id}  Visible: ${this.node.visible}  DistanceToConnect: ${dst}`;
    }

    connectAudioToModule(mod) {
        super.canConnectToModule(mod);
        this.moduleConnect = mod;
        mod.LFOM = this;
    }

    disconectAudio() {
        super.disconectAudio();
        this.moduleConnect.LFOM = null;
    }


}