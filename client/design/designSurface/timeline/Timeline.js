
class Timeline {
    constructor(containerId) {
        this.containerId = containerId;
        this.initTimeline();
    }

    initTimeline() {
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
                updateGroup: true,
                remove: false
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
            }
        };

        var groups = new vis.DataSet();
        groups.add({
            id: "music",
            content: "Music"
        });
        groups.add({
            id: "labels",
            content: "Labels"
        });

        var items = new vis.DataSet();
        items.add({
            id: "1",
            group: "music",
            start: new Date(1),
            end: new Date(9), // len + 1
            content: "Liberty Bell Intro"
        });
        items.add({
            id: "2",
            group: "music",
            start: new Date(9),
            end: new Date(41), // len + 1
            content: "Liberty Bell 1st Strain"
        });
        items.add({
            id: "3",
            group: "music",
            start: new Date(41),
            end: new Date(74), // len + 1
            content: "Liberty Bell 2nd Strain"
        });

        // Create a Timeline
        //var timeline = new vis.Timeline(container, items, options);
        this.timeline = new vis.Timeline(container);
        this.timeline.setOptions(options);
        this.timeline.setGroups(groups);//
        this.timeline.setItems(items);
        this.timeline.moveTo(new Date(1));
        this.timeline.zoomIn(0.5);
        
    }
}

export default Timeline;