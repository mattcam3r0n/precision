import DrillPlayer from './DrillPlayer';

class DrillScheduler {
    constructor() {
    }

    createSchedule(drill) {
        let saveCount = drill.count;

        let schedule = {
            steps: [],
            music: this.getDistinctFiles(drill),
        };

        // TODO: need a way to get lenght of drill / end count
        let player = new DrillPlayer(drill);
        let lastTime = 0;
        let lastTimeInterval = 0;
        let startCount = drill.count + 1;
        while (!player.isEndOfDrill()) {
            player.stepForward();
            let step = this.createCountDescriptor(drill,
                startCount,
                drill.count,
                lastTime,
                lastTimeInterval);
            lastTime = step.time;
            lastTimeInterval = step.timeInterval;
            schedule.steps.push(step);
        }

        // TODO: need a way to move thru drill without affecting drillstate
        // reset drill
        player.goToCount(saveCount);

        return schedule;
    }

    getDistinctFiles(drill) {
        if (!drill.music) {
            return [];
        }
        return [...new Set(drill.music.map((m) => m.url))];
    }

    getMusicAtCount(drill, count) {
        if (!drill.music) return null;

        return drill.music.find((m) => {
            return m.startCount <= count && m.endCount >= count;
        });
    }

    createCountDescriptor(drill, startCount, count,
                            lastTime, lastTimeInterval) {
        let music = this.getMusicAtCount(drill, count);
        let tempo = music ? music.tempo : drill.tempo || 120;
        let timeInterval = 60 / tempo;
        if (music && music.beats && music.beats[count - startCount]) {
            timeInterval = music.beats[count - music.startCount].timeInterval;
        }
        // if timeInterval is 0 (at start of new music), use lastTimeInterval to add
        // appropriate space between stop of last clip and start of new
        let time = count == startCount
            ? 0
            : lastTime + (timeInterval || lastTimeInterval);

        return {
            count: count,
            time: time,
            timeInterval: timeInterval,
            tempo: tempo,
            music: this.createMusicDescriptor(music, startCount,
                                                count, timeInterval),
        };
    }

    createMusicDescriptor(music, startCount, count, tempoInterval) {
        if (!music) return null;

        let offset = 0;
        if (music.startCount < count) {
            if (music && music.beats && music.beats.length > 0) {
                offset = music.beats[count - music.startCount].timeOffset;
            } else {
                offset = (count - music.startCount) * tempoInterval;
            }
        }

        let startOffset = music.startOffset + offset;
        let duration = music.duration - offset;

        return {
            fileName: music.fileName,
            url: music.url,
            startCount: startCount > music.startCount
                ? startCount
                : music.startCount,
            endCount: music.endCount,
            startOffset: startOffset,
            duration: duration,
        };
    }
}

export default DrillScheduler;
