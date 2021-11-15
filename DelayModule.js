class DelayModule extends EffectModule {


    constructor() {
        super();
        this.delay = new Tone.FeedbackDelay("2n", 0.5);
        this.audioNode = this.delay;
        this.outputAudioNode = this.delay;
        this.mappings.rotZ = "delayTime";
        this.mappings.rotX = "feedBack";
        this.dt;
        this.fb;
    }

    setAudioParameter(parameterName, value) {

        if (parameterName === "delayTime") {
            const val = (Math.round(value * 14) + 2).toString() + "n";
            this.dt = val;
            this.delay.set({delayTime: val});
        }
        if (parameterName === "feedBack") {
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