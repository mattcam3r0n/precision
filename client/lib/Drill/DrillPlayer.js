import MemberPlayer from '/client/lib/drill/MemberPlayer';
import DrillScheduler from './DrillScheduler';
import Audio from '/client/lib/audio/Audio';

var lastTimestamp = 0;
var requestAnimationFrame = window.requestAnimationFrame 
    || window.mozRequestAnimationFrame 
    || window.webkitRequestAnimationFrame 
    || window.msRequestAnimationFrame;

var cancelRequestAnimationFrame = window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame;

/**
 * Contains logic that manipulates current position/count of a drill.
 */
class DrillPlayer {
    constructor(drill) {
        this.drill = drill;
        this.tempo = 120;
        this.drill.count = this.drill.count || 0; // ensure there is a count
    }

    setTempo(tempo) {
        this.tempo = tempo || 120;
    }
    
    play(stateChangedCallback, playLength) {
        var self = this;
        self.stopCount = 0;
        if (playLength) { // rework this around schedule? only schedule n counts?
            self.stopCount = self.drill.count + playLength;
        }

        self.schedule = new DrillScheduler().createSchedule(self.drill);

        // TODO: remove
        console.log(self.schedule);

        self.startTimestamp = 0; // get current audio timestamp?
        self.lastTimestamp = 0;
        self.currentMusic = null;

        self.stateChangedCallback = stateChangedCallback;

        Audio
            .load(self.schedule.music)
            .then((buffers) => {
                self.animationHandle = requestAnimationFrame(self.animate.bind(self));           
            });

    }

    stop() {
        cancelAnimationFrame(this.animationHandle);
    }

    isPastStopCount() {
        return this.stopCount > 0 && this.drill.count >= this.stopCount;
    }

    animate(timestamp) {
        var self = this;
        var tempoInMS = (60 / self.tempo) * 1000;

        var nextStep = self.schedule.steps[self.drill.count];

        if (self.startTimestamp == 0)
            self.startTimestamp = timestamp;

        if (timestamp >= self.startTimestamp + (nextStep.time * 1000)) {

            self.lastTimestamp = timestamp;
            self.stepForward();
            self.stateChangedCallback();

            //self.schedule.steps.shift();
            nextStep = self.schedule.steps[self.drill.count];
            if (nextStep && nextStep.music && nextStep.music.startCount == self.drill.count) {
                self.currentMusic = nextStep.music.fileName;
                Audio.play(self.currentMusic, nextStep.music.startOffset, nextStep.music.duration);
            }
    
            if (self.isEndOfDrill() || self.isPastStopCount()) {
                console.log("Reached end of drill.");
                self.stop();
                return;
            }    
        }

        this.animationHandle = requestAnimationFrame(this.animate.bind(this));
    }

    stepForward() {
        if (this.isEndOfDrill()) return;
        this.drill.members.forEach(m => {
            MemberPlayer.stepForward(m);
        });
        this.drill.count++;
    }

    stepBackward() {
        if (this.isBeginningOfDrill()) return;
        this.drill.members.forEach(m => MemberPlayer.stepBackward(m));
        this.drill.count--;
    }

    isBeginningOfDrill() {
        // true if all members are at 0;   
        return this.drill.members.every(m => MemberPlayer.isBeginningOfDrill(m));
    }

    isEndOfDrill() {
        if (!this.drill.members || this.drill.members.length == 0) return true;

        // true if all members are at end
        return this.drill.members.some(m => MemberPlayer.isEndOfDrill(m));
    }

    goToBeginning() {
        this.drill.count = 0;
        this.drill.members.forEach(m => MemberPlayer.goToBeginning(m));
    }

    goToCount(count) {
        //TODO: need a better way to do this
        this.goToBeginning();
        while(this.drill.count < count && !this.isEndOfDrill()) {
            this.stepForward();
        }
    }

    goToEnd() {
        while (!this.isEndOfDrill()) {
            this.stepForward();
        }
    }
}

export default DrillPlayer;