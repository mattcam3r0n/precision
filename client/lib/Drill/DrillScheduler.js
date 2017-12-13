import DrillPlayer from './DrillPlayer';

class DrillScheduler {
    constructor() {
    }

    createSchedule(drill) {
        var saveCount = drill.count;

        var schedule = {
            steps: [],
            music: ['/audio/Liberty Bell Intro.ogg', '/audio/Liberty Bell Intro.ogg']
        };

console.log(drill.music);

        // TODO: need a way to get lenght of drill / end count
        var player = new DrillPlayer(drill);
        var lastTime = 0;
        var startCount = drill.count;
        while (!player.isEndOfDrill()) {
            var step = this.createCountDescriptor(drill, startCount, drill.count, lastTime);
            lastTime = step.time;
            schedule.steps.push(step);
            player.stepForward();
        }

        // TODO: need a way to move thru drill without affecting drillstate
        // reset drill
        player.goToCount(saveCount);

        return schedule;
    }

    getMusicAtCount(drill, count) {
        if (!drill.music) return null;

        return drill.music.find(m => {
            return m.startCount <= count && m.endCount >= count;
        });
    }

    createCountDescriptor(drill, startCount, count, lastTime) {
        var music = this.getMusicAtCount(drill, count);
        var tempo = music ? music.tempo : drill.tempo || 120;
        var tempoInterval = 60 / tempo; 
        var time = lastTime + tempoInterval;

        return {
            count: count,
            time: time,
            tempo: tempo,
            music: this.createMusicDescriptor(music, startCount, count, tempoInterval)
        };
    }

    createMusicDescriptor(music, startCount, count, tempoInterval) {
        if (!music) return null;

        var offset = 0;
        if (music.startCount < count) {
            offset = (count - music.startCount) * tempoInterval;
        }

        var musicStartOffset = music.startOffset + offset;
        var duration = music.duration - offset;

        return {
            fileName: music.fileName,
            startCount: startCount > music.startCount ? startCount + 1 : music.startCount,
            endCount: music.endCount,
            musicStartOffset: musicStartOffset,
            duration: duration
        };
    }
}

export default DrillScheduler;