import AnimationLoop from '/client/lib/AnimationLoop';
import Audio from '/client/lib/audio/Audio';

class Metronome {
    constructor(clock, beats) {
        this.clock = clock;
        this.beats = beats;
        this.nextBeat = 0;
    }

    start() {
        this.animationLoop = new AnimationLoop(this.callback.bind(this));
        this.startTime = this.clock.getCurrentTime();
        this.animationLoop.start();
    }

    callback() {
        var timeOffset = this.clock.getCurrentTime() - this.startTime;
        if (this.nextBeat < this.beats.length && timeOffset >= this.beats[this.nextBeat].timeOffset) {
            console.log('beat');
            Audio.playMetronome();
            this.nextBeat++;
        }
    }

    stop() {
        this.animationLoop.stop();
    }
}

export default Metronome;
