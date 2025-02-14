class AudioManager {
    constructor() {
        this.synth = new Tone.Synth().toDestination();
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            await Tone.start();
            this.initialized = true;
        }
    }

    playCollectSound() {
        if (this.initialized) {
            this.synth.triggerAttackRelease("C5", "8n");
        }
    }

    playLetterSound() {
        if (this.initialized) {
            this.synth.triggerAttackRelease("E5", "8n");
        }
    }

    playGameOverSound() {
        if (this.initialized) {
            this.synth.triggerAttackRelease("G3", "4n");
        }
    }
}
