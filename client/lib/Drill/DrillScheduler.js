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

        // TODO: need a way to get length of drill / end count
        let player = new DrillPlayer(drill);
        let lastTime = 0;
        let lastTimeInterval = 0;
        let startCount = drill.count + 1;

        try {
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
        } catch (ex) {
            const msg = 'createSchedule: ' + ex.message;
            const context = {
                drillId: drill._id,
                count: drill.count,
                startCount: startCount,
                lastTime: lastTime,
                lastTimeInterval: lastTimeInterval,
            };
            throw new DrillSchedulerException(msg, ex, context);
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
        const music = drill.music.filter((m) => m.url);
        return [...new Set(music.map((m) => m.url))];
    }

    getMusicAtCount(drill, count) {
        if (!drill.music) return null;

        return drill.music.find((m) => {
            return m.startCount <= count && m.endCount >= count;
        });
    }

    createCountDescriptor(drill, startCount, count,
                            lastTime, lastTimeInterval) {
        let music;
        let tempo;
        let timeInterval;
        let time;
        try {
            music = this.getMusicAtCount(drill, count);
            tempo = music ? music.tempo : drill.tempo || 120;
            timeInterval = 60 / tempo;
            if (music && music.beats && music.beats[count - music.startCount]) {
                timeInterval = music.beats[count - music.startCount]
                .timeInterval;
            }
            // if its the first count of the music, set the interval to 0. the lastTimeInterval will be used
            if (music && count - music.startCount == 0) {
                timeInterval = 0;
            }
            // if timeInterval is 0 (at start of new music), use lastTimeInterval to add
            // appropriate space between stop of last clip and start of new
            time = count == startCount
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
        } catch (err) {
            const msg = 'createCountDescriptor: ' + (err.message || err.toString());
            const context = {
                drill: drill._id,
                music: music,
                count: count,
                tempo: tempo,
                timeInterval: timeInterval,
                time: time,
                startCount: startCount,
            };
            throw new DrillSchedulerException(msg, err, context);
        }
    }

    createMusicDescriptor(music, startCount, count, tempoInterval) {
        if (!music) return null;

        let offset;
        let startOffset;
        let duration;
        try {
            offset = 0;
            if (music.startCount < count) {
                const offsetCount = count - music.startCount;
                if (music && music.beats
                        && music.beats.length > 0
                        && offsetCount < music.beats.length) {
                            offset = music.beats[offsetCount].timeOffset;
                } else {
                    offset = offsetCount * tempoInterval;
                }
            }
            startOffset = music.startOffset + offset;
            duration = music.duration - offset;

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
        } catch (err) {
            const msg = 'createMusicDescriptor: ' + err.message || err;
            const context = {
                music: music,
                startCount: startCount,
                count: count,
                tempoInterval: tempoInterval,
                offset: offset,
                startOffset: startOffset,
                duration: duration,
            };
            throw new DrillSchedulerException(msg, err, context);
        }
    }
}

class DrillSchedulerException {
    constructor(msg, inner, context) {
        this.message = msg;
        this.inner = inner;
        this.context = context;
    }

    toString() {
        return this.message;
    }
}

export default DrillScheduler;
