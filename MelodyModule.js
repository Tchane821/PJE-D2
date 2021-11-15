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
        this.debugZone = document.getElementById("debugZone");

        this.loop = new Tone.Loop(time => {
            this.audioNode.triggerAttackRelease(this.notes[this.curNote], this.noteDuration, time);
            this.curNote = (this.curNote + 1) % this.notes.length;
        }, "4n").start(0);

    }

    setAudioParameter(parameterName, value) {
        if (parameterName === "NoteDuration") {
            this.noteDuration = (value + 1) + 0.01;
        }
        if (parameterName === "Harmonicity") {
            this.audioNode.harmonicity.value = value * -1;

        }
        if (parameterName === "Tempo") {
            this.Tempo = value;
            this.debugZone.innerHTML = this.noteDuration.toString() + "  " + value.toString();
        }
    }


}