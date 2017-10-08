import MemberPlayer from '/client/lib/drill/MemberPlayer';

/**
 * Contains logic that manipulates current position/count of a drill.
 */
class DrillPlayer {
    constructor(drill) {
        this.drill = drill;
        this.tempo = 120;
        this.drill.count = this.drill.count || 0; // ensure there is a count
    }

    play() {

    }

    stop() {

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
        return this.drill.members.every(m => MemberPlayer.isEndOfDrill(m));
    }

    goToBeginning() {
        this.drill.count = 0;
        this.drill.members.forEach(m => MemberPlayer.goToBeginning(m));
    }

    goToEnd() {
        while(!this.isEndOfDrill()) {
            this.stepForward();
        }
    }
}

export default DrillPlayer;