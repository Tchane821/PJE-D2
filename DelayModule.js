class DelayModule extends EffectModule {


    constructor() {
        super();
        this.delay = new Tone.FeedbackDelay("2n", 0.5);
        this.audioNode = this.delay;
        this.outputAudioNode = this.delay;
        this.parameter = ["DelayTime","FeedBack"];
        this.mappings.rotZ = "DelayTime";
        this.mappings.rotX = "FeedBack";
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