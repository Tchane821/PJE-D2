class MelodyModule extends SourceModule {

    constructor() {
        super();
        this.notes = ["C4", "D4", "E4"];
        this.curNote = 0;
        this.Tempo = 1;
        this.noteDuration = 0.01;
        this.mappings.posZ = "Harmonicity";
        this.mappings.rotZ = "NoteDuration";
        this.mappings.rotY = "Tempo";
        this.audioNode = new Tone.AMSynth();
        //this.audioNode.connect(this.meter);

        this.loop = new Tone.Loop(time => {
            this.audioNode.triggerAttackRelease(this.notes[this.curNote], this.noteDuration, time);
            this.curNote = (this.curNote + 1) % this.notes.length;
        }, "4n").start(0);

    }

    setAudioParameter(parameterName, value) {
        if (parameterName === "NoteDuration") {
            this.noteDuration = value * 1.5 + 0.01; // de 0.01 a 1.51
        }
        if (parameterName === "Harmonicity") {
            this.audioNode.harmonicity.value = value * -1;

        }
        if (parameterName === "Tempo") {
            this.Tempo = value;

        }
    }

    debugPrint() {
        let wp1 = new THREE.Vector3();
        this.node.getWorldPosition(wp1);
        let dst = this.distanceWp(wp1, this.posToConnect);
        this.debugMark.innerHTML = `Name: MelodyM NoteDuration: ${this.noteDuration}    Id: ${this.id}  Visible: ${this.node.visible}   DistanceToConnect: ${dst} `; //MeterV: ${this.meter.getValue()}
    }


}