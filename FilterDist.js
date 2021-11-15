class FilterDist extends EffectModule {

    constructor() {
        super();
        this.distortion = new Tone.Distortion();
        this.audioNode = new Tone.Filter();
        this.distortion.connect(this.audioNode);

        this.mappings.posZ = "Filter";
        this.mappings.rotZ = "Distortion";

    }

    setAudioParameter(parameterName, value) {

        if (parameterName === "Filter") {
            this.audioNode.set({frequency : value * -1 ,type:"highpass"});
        }
        if (parameterName === "Distortion") {
            this.distortion.distortion = value;
        }
    }


}