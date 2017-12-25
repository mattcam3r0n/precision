import shortid from 'shortid';

class Timeline {
    constructor(containerId) {
        this.containerId = containerId;
        this.items = new vis.DataSet();
        this.groups = new vis.DataSet();
        this.initTimeline();
    }

    initTimeline() {
        var self = this;
        var container = document.getElementById(this.containerId);

        var options = {
            height: '180px',
            // zoomMin: 1000,                    // 1 second
            // zoomMax: 1000 * 60 * 60 * 24,     // 1 day
            verticalScroll: true,
            orientation: {
                axis: 'bottom'
            },
            editable: {
                add: true,
                updateTime: true,
                updateGroup: false,
                remove: true
            },
            showMajorLabels: false,
            maxMinorChars: 4,
            // timeAxis: {
            //     scale: 'millisecond',
            //     step: 4
            // },
            start: new Date(0),
            end: new Date(1000 * 2),
            min: new Date(0),
            max: new Date(1000 * 2),
            zoomMin: 20,
            zoomMax: 1000,
            format: {
                minorLabels: function (date, scale, step) {
                    return new Date(date).getTime();
                }
            },
            onMove: this.onMove,
            onRemove: this.onRemove.bind(this),
            template: this.itemTemplate
        };

        this.groups.add({
            id: "music",
            content: "Music"
        });
        // this.groups.add({
        //     id: "labels",
        //     content: "Labels"
        // });

        // Create a Timeline
        //var timeline = new vis.Timeline(container, items, options);
        this.timeline = new vis.Timeline(container);
        this.timeline.setOptions(options);
        this.timeline.setGroups(this.groups);//
        this.timeline.setItems(this.items);

        this.timeline.on('doubleClick', function (props) {
            var count = props.time.getMilliseconds();
            self.moveTo(count);
            self.setCurrentCount(count);
            if (self.onGoToCountCallback) {
                self.onGoToCountCallback(count);
            }
            console.log(count);
        });

        this.currentCountBar = this.timeline.addCustomTime(new Date(0), 'currentCountBar');
    }

    goToBeginning() {
        this.timeline.moveTo(new Date(1));
    }

    goToEnd() {

    }

    pageForward() {
        this.move(-0.9);
    }

    pageBackward() {
        this.move(0.9);
    }

    zoomIn() {
        this.timeline.zoomIn(0.5);        
    }

    zoomOut() {
        this.timeline.zoomOut(0.5);        
    }

    zoomToCount(count) {
        var offset = 10;
        var start = count - offset <= 0 ? 1 : count - offset;
        var end = start == 1 ? 25 : count + offset;
        this.timeline.setWindow(new Date(start), new Date(end), null, ()=> {
            this.setCurrentCount(count);                    
        });
    }

    setCurrentCount(count) {
        this.timeline.setCustomTime(new Date(count), this.currentCountBar);
    }

    isCountVisible(count) {
        var countTime = new Date(count);
        var window = this.timeline.getWindow();
        return window.start <= countTime && window.end >= countTime;
    }

    getVisibleCountRange() {
        var window = this.timeline.getWindow();
        return {
            start: window.start.getMilliseconds(),
            end: window.end.getMilliseconds()
        };
    }

    moveTo(count) {
        this.timeline.moveTo(new Date(count), { animation: false });
    }

    move(percentage) {
        var range = this.timeline.getWindow();
        var interval = range.end - range.start;

        this.timeline.setWindow({
            start: range.start.valueOf() - interval * percentage,
            end: range.end.valueOf() - interval * percentage
        });
    }

    setMusicItems(musicList) {
        if (!musicList) return;

        musicList.forEach(m => {
            var item = this.createMusicItem(m);
            this.items.update(item);
        });
    }

    setOnRemoveCallback(cb) {
        this.onRemoveCallback = cb;
    }

    setOnGoToCountCallback(cb) {
        this.onGoToCountCallback = cb;
    }

    createMusicItem(music) {
        return {
            id: music.id || shortid.generate(), // music obj should prob have this id
            group: "music",
            start: new Date(music.startCount),
            end: new Date(music.endCount + 1),
            //content: music.title || music.fileName, // change to desc
            music: music
        };
    }

    onMove(item, callback) {
        // update music item in drill when moved on timeline
        // each count is represented by a millisecond
        item.music.startCount = item.start.getMilliseconds();
        item.music.endCount = item.end.getMilliseconds() - 1;
    }

    onRemove(item, callback) {
        var self = this;
        if (self.onRemoveCallback) {
            if (self.onRemoveCallback(item)) {
                callback(item); // remove
            }
            else {
                callback(null); // cancel removal
            }
        }
    }

    itemTemplate(item, element, data) {
        var html = `
            <span>${item.music.title || item.music.fileName}</span>
        `;
        return html;
    }
    
        
}

export default Timeline;