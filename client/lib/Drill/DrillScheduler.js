import DrillPlayer from './DrillPlayer';

class DrillScheduler {
    constructor() {
    }

    createSchedule(drill) {
        var saveCount = drill.count;

        var schedule = {
            steps: [],
            music: this.getDistinctFiles(drill)
        };

        // TODO: need a way to get lenght of drill / end count
        var player = new DrillPlayer(drill);
        var lastTime = 0;
        var startCount = drill.count + 1;
        while (!player.isEndOfDrill()) {
            player.stepForward();
            var step = this.createCountDescriptor(drill, startCount, drill.count, lastTime);
            lastTime = step.time;
            schedule.steps.push(step);
        }

        // TODO: need a way to move thru drill without affecting drillstate
        // reset drill
        player.goToCount(saveCount);

        return schedule;
    }

    getDistinctFiles(drill) {
        return [...new Set(drill.music.map(m => m.fileName))]
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
        var timeInterval = 60 / tempo; 
        if (music && music.beats && music.beats[count - startCount]) {
            timeInterval = music.beats[count - music.startCount].timeInterval;
        }
        var time = count == startCount ? 0 : lastTime + timeInterval;

        return {
            count: count,
            time: time,
            tempo: tempo,
            music: this.createMusicDescriptor(music, startCount, count, timeInterval)
        };
    }

    createMusicDescriptor(music, startCount, count, tempoInterval) {
        if (!music) return null;

        var offset = 0;
        if (music.startCount < count) {
            if (music && music.beats && music.beats.length > 0) {
                offset = music.beats[count - music.startCount].timeOffset;
            } else {
                offset = (count - music.startCount) * tempoInterval;                
            }
        }

        var startOffset = music.startOffset + offset;
        var duration = music.duration - offset;
        
        return {
            fileName: music.fileName,
            startCount: startCount > music.startCount ? startCount : music.startCount,
            endCount: music.endCount,
            startOffset: startOffset,
            duration: duration
        };
    }
}

export default DrillScheduler;