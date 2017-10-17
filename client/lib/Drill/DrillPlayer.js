import MemberPlayer from '/client/lib/drill/MemberPlayer';

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
        this.tempo = tempo;
    }
    
    play(stateChangedCallback) {
        this.stateChangedCallback = stateChangedCallback;
        this.animationHandle = requestAnimationFrame(this.animate.bind(this));
    }

    stop() {
        cancelAnimationFrame(this.animationHandle);
    }

    animate(timestamp) {
        var self = this;

        var tempoInMS = (60 / self.tempo) * 1000;

        if (timestamp - lastTimestamp >= tempoInMS) {
            lastTimestamp = timestamp;
            self.stepForward();
            self.stateChangedCallback();
    
            if (self.isEndOfDrill()) {
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
        // true if all members are at end
        return this.drill.members.some(m => MemberPlayer.isEndOfDrill(m));
    }

    goToBeginning() {
        this.drill.count = 0;
        this.drill.members.forEach(m => MemberPlayer.goToBeginning(m));
    }

    goToEnd() {
        while (!this.isEndOfDrill()) {
            this.stepForward();
        }
    }
}

export default DrillPlayer;