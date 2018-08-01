import Logger from '/client/lib/Logger';
import Events from '/client/lib/Events';
import MemberPlayer from '/client/lib/drill/MemberPlayer';
import DrillScheduler from './DrillScheduler';
import Audio from '/client/lib/audio/Audio';
import AnimationLoop from '/client/lib/AnimationLoop';

/**
 * Contains logic that manipulates current position/count of a drill.
 */
class DrillPlayer {
    constructor(drill, eventService) {
        this.drill = drill;
        this.eventService = eventService;
        this.tempo = 120;
        this.drill.count = this.drill.count || 0; // ensure there is a count
        this.isPlaying = false;
    }

    setTempo(tempo) {
        this.tempo = tempo || 120;
    }

    play(stateChangedCallback, counts, playMusic, playMetronome) {
        let self = this;
        if (self.isPlaying) return;

        self.playMusic = playMusic || false;
        self.playMetronome = playMetronome || false;
        self.stopCount = 0;
        if (counts) { // rework this around schedule? only schedule n counts?
            self.stopCount = self.drill.count + counts;
        }
        self.schedule = new DrillScheduler().createSchedule(self.drill);

        self.startCount = self.drill.count;
        self.startTimestamp = 0; // get current audio timestamp?
        self.lastTimestamp = 0;
        self.currentMusic = null;

        self.stateChangedCallback = stateChangedCallback;

        this.startSpinner();
        this.loadMusic(playMusic)
            .then(() => {
                this.stopSpinner();
                self.animationLoop = new AnimationLoop(self.animate.bind(self));
                self.isPlaying = true;
                self.animationLoop.start();
            })
            .catch((err) => {
                let msg = 'Unable to load music.';
                Logger.error(msg, {
                    error: err,
                });
                self.isPlaying = false;
                this.stopSpinner();
            });
    }

    loadMusic(playMusic) {
        if (this.hasMusic() && playMusic) {
            return Audio.load(this.schedule.music);
        };

        return Promise.resolve();
    }

    hasMusic() {
        const { schedule } = this;
        return schedule && schedule.music && schedule.music.length > 0;
    }

    startSpinner() {
        if (this.eventService) {
            this.eventService.notify(Events.showSpinner);
        }
    }

    stopSpinner() {
        if (this.eventService) {
            this.eventService.notify(Events.hideSpinner);
        }
    }

    stop() {
        this.animationLoop.stop();
        this.isPlaying = false;
    }

    isPastStopCount() {
        return this.stopCount > 0 && this.drill.count >= this.stopCount;
    }

    animate() {
        let self = this;
        let nextStep = self.schedule.steps[self.drill.count - self.startCount];
        const timestamp = Audio.currentTime;

        if (self.startTimestamp == 0) {
            self.startTimestamp = timestamp;
        }

        if (nextStep && (timestamp >= self.startTimestamp
            + nextStep.time)) {
            self.lastTimestamp = timestamp;

            self.stepForward(true);
            self.stateChangedCallback();

            if (self.playMetronome) {
                Audio.playMetronome();
            }

            if (self.playMusic
                && nextStep
                && nextStep.music
                && nextStep.music.type != 'tempo'
                && nextStep.music.startCount == self.drill.count) {
                self.currentMusic = nextStep.music.url;
                Audio.play(self.currentMusic,
                    nextStep.music.startOffset,
                    nextStep.music.duration);
            }

            nextStep = self.schedule.steps[self.drill.count - self.startCount];

            if (!nextStep || self.isPastStopCount()) {
                self.stop();
                return;
            }
        }
    }

    stepForward(skipEndCheck = false) {
        if (!skipEndCheck && this.isEndOfDrill()) return;
        this.drill.members.forEach((m) => {
            MemberPlayer.stepForward(m);
        });
        this.drill.count++;
    }

    stepBackward() {
        if (this.isBeginningOfDrill()) return;
        this.drill.members.forEach((m) => MemberPlayer.stepBackward(m));
        this.drill.count--;
    }

    getCountsInDrill() {
        // ugh... need a better way!!!!
        // clone the drill
        const clone = JSON.parse(JSON.stringify(this.drill));
        // create a new player
        const player = new DrillPlayer(clone);
        // go to beginning
        player.goToBeginning();
        // step thru drill
        while (!player.isEndOfDrill()) {
            player.stepForward();
        }
        return clone.count;
    }

    isBeginningOfDrill() {
        // true if all members are at 0;
        return this.drill
            .members
            .every((m) => MemberPlayer.isBeginningOfDrill(m));
    }

    isEndOfDrill() {
        if (!this.drill.members || this.drill.members.length == 0) return true;

        // true if all members are at end
        return this.drill.members.every((m) => MemberPlayer.isEndOfDrill(m));
    }

    goToBeginning() {
        this.drill.count = 0;
        this.drill.members.forEach((m) => MemberPlayer.goToBeginning(m));
    }

    goToCount(count) {
        // TODO: need a better way to do this
        this.goToBeginning();
        while (this.drill.count < count && !this.isEndOfDrill()) {
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
