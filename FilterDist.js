class FilterDist extends EffectModule {

    constructor() {
        super();
        this.distortion = new Tone.Distortion();
        this.audioNode = new Tone.Filter(1500,"highpass");
        this.distortion.connect(this.audioNode);

        this.mappings.posZ = "Filter";
        this.mappings.rotZ = "Distortion";

    }

    setAudioParameter(parameterName, value) {

        if (parameterName === "Filter") {
            value = (value * -1) % 10; // entre 0 et 10
            this.audioNode.frequency.rampTo(value * 1850 + 1500,1);
        }

        if (parameterName === "Distortion") {
            this.distortion.distortion = value;
        }
    }

    debugPrint() {
        let wp1 = new THREE.Vector3();
        this.node.getWorldPosition(wp1);
        let dst = this.distanceWp(wp1, this.posToConnect);
        this.debugMark.innerHTML = `Name: Filter HighPass Distortion: ${this.distortion.distortion}    Frequency: ${this.audioNode.get("frequency")}    Id: ${this.id}  Visible: ${this.node.visible}   DistanceToConnect: ${dst}`;
    }


}