class DrumsModule extends SourceModule {


    constructor() {
        super();
        this.kick = new Tone.MembraneSynth();
        this.snare = new Tone.NoiseSynth();
        this.audioNode = new Tone.Gain();
        this.kick.connect(this.audioNode);
        this.snare.connect(this.audioNode);
        //this.audioNode.connect(this.meter);

        this.mappings.rotZ = "switch";

        this.kickPatterns =  [[1, 0, 1, 0, 1, 0, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1],[1, 0, 1, 0, 1, 0, 1, 0]];
        this.snarePatterns = [[1, 0, 1, 0, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1],[1, 0, 1, 0, 1, 0, 1, 0]];

        this.curNote = 0;
        this.kickPat = 0;
        this.snarePat = 0;

        this.loop = new Tone.Loop(time => {
            if (this.kickPatterns[this.kickPat][this.curNote] !== 0) {
                this.kick.triggerAttackRelease("C2", "8n", time);
            }
            if (this.snarePatterns[this.snarePat][this.curNote] !== 0) {
                this.snare.triggerAttackRelease("8n", time);
            }

            this.curNote = (this.curNote + 1) % this.kickPatterns[0].length;
        }, "8n").start(0);

    }

    setAudioParameter(parameterName, value) {
        if (parameterName === "switch") {
            const maxIdPat = this.kickPatterns.length - 1;
            const val = Math.round(value * maxIdPat);
            this.kickPat = val;
            this.snarePat = val;
        }
    }

    debugPrint() {
        let wp1 = new THREE.Vector3();
        this.node.getWorldPosition(wp1);
        let dst = this.distanceWp(wp1, this.posToConnect);
        this.debugMark.innerHTML = `Name: DrumsM PatSelect: ${this.kickPat} Id: ${this.id}  Visible: ${this.node.visible}  DistanceToConnect: ${dst}`;
    }


}