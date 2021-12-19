class MelodyModule extends SourceModule {

    constructor() {
        super();
        const geometry = new THREE.OctahedronGeometry(0.8, 0);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.mesh = new THREE.Mesh(geometry, material);
        this.node.add(this.mesh);
        this.mesh.userData = this;
        this.notes = ["C4", "D4", "E4"];
        this.curNote = 0;
        this.Tempo = 1;
        this.noteDuration = 0.01;
        this.mappings.POS_Z = "Harmonicity";
        this.mappings.ROT_Z = "NoteDuration";
        this.mappings.ROT_Y = "Tempo";
        this.parameter = ["Harmonicity", "NoteDuration", "Tempo"];
        this.audioNode = new Tone.AMSynth();


        this.loop = new Tone.Loop(time => {
            this.audioNode.triggerAttackRelease(this.notes[this.curNote], this.noteDuration, time);
            this.curNote = (this.curNote + 1) % this.notes.length;
        }, "4n").start(0);

    }

    setAudioParameter(parameterName, value) {
        if (parameterName === "NoteDuration") {
            this.noteDuration = value * 0.249 + 0.01; // de 0.01 a 0.25
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
        this.debugMark.innerHTML = `Name: MelodyM NoteDuration: ${this.noteDuration}    Id: ${this.id}  Visible: ${this.node.visible}   DistanceToConnect: ${dst}`;
    }
}