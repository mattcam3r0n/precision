import Events from '/client/lib/Events';
import shortid from 'shortid';

class Timeline {
  constructor(containerId, eventService) {
    this.eventService = eventService;
    this.containerId = containerId;
    this.items = new vis.DataSet();
    this.groups = new vis.DataSet();
    this.templates = {
      music: this.musicItemTemplate.bind(this),
      bookmarks: this.bookmarkItemTemplate.bind(this),
    };
    this.initTimeline();
  }

  initTimeline() {
    let container = document.getElementById(this.containerId);

    let options = {
      height: '85px',
      // zoomMin: 1000,                    // 1 second
      // zoomMax: 1000 * 60 * 60 * 24,     // 1 day
      verticalScroll: true,
      orientation: {
        axis: 'bottom',
      },
      stack: false,
      editable: {
        add: false,
        updateTime: true,
        updateGroup: false,
        remove: true,
      },
      margin: {
        axis: 5,
        item: 5,
      },
      showMajorLabels: false,
      maxMinorChars: 4,
      // timeAxis: {
      //     scale: 'millisecond',
      //     step: 4
      // },
      start: new Date(0),
      end: new Date(25),
      min: new Date(0),
      max: new Date(1000 * 2),
      zoomMin: 20,
      zoomMax: 1000,
      format: {
        minorLabels: function(date, scale, step) {
          return new Date(date).getTime();
        },
      },
      onMove: this.onMove.bind(this),
      onRemove: this.onRemove.bind(this),
      template: this.itemTemplate.bind(this),
    };

    this.groups.add([
      {
        id: 'bookmarks',
        content: 'Bookmarks',
      },
      {
        id: 'music',
        content: 'Music',
      },
    ]);
    // this.groups.add({
    //     id: 'bookmarks',
    //     content: 'Bookmarks',
    // });
    // this.groups.add({
    //     id: "labels",
    //     content: "Labels"
    // });

    // Create a Timeline
    // var timeline = new vis.Timeline(container, items, options);
    this.timeline = new vis.Timeline(container, null, options);
    //        this.timeline.setOptions(options);
    this.timeline.setGroups(this.groups); //
    this.timeline.setItems(this.items);

    this.timeline.on('doubleClick', this.onDoubleClick.bind(this));

    this.timeline.on('contextmenu', this.onContextMenu.bind(this));

    this.currentCountBar = this.timeline.addCustomTime(
      new Date(0),
      'currentCountBar'
    );
  }

  goToBeginning() {
    this.timeline.moveTo(new Date(1));
  }

  goToEnd() {}

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

  setWindow(startCount, endCount) {
    this.timeline.setWindow(new Date(startCount), new Date(endCount));
  }

  zoomToCount(count) {
    let offset = 10;
    let start = count - offset <= 0 ? 1 : count - offset;
    let end = start == 1 ? 25 : count + offset;
    this.timeline.setWindow(new Date(start), new Date(end), null, () => {
      this.setCurrentCount(count);
    });
  }

  setCurrentCount(count) {
    this.timeline.setCustomTime(new Date(count), this.currentCountBar);
  }

  isCountVisible(count) {
    let countTime = new Date(count);
    let window = this.timeline.getWindow();
    return window.start <= countTime && window.end - 1 >= countTime;
  }

  getVisibleCountRange() {
    let window = this.timeline.getWindow();
    return {
      start: window.start.getMilliseconds(),
      end: window.end.getMilliseconds(),
    };
  }

  moveTo(count) {
    this.timeline.moveTo(new Date(count), { animation: false });
  }

  move(percentage) {
    let range = this.timeline.getWindow();
    let interval = range.end - range.start;

    this.timeline.setWindow({
      start: range.start.valueOf() - interval * percentage,
      end: range.end.valueOf() - interval * percentage,
    });
  }

  setItems(data) {
    // expects an object with groups of items as properties
    this.items.clear();

    this.addMusicItems(data.music);
    this.addBookmarkItems(data.bookmarks);
  }

  addMusicItems(musicList) {
    if (!musicList) return;

    musicList.forEach((m) => {
      let item = this.createMusicItem(m);
      this.items.update(item);
    });
  }

  addBookmarkItems(bookmarks) {
    if (!bookmarks) return;

    bookmarks.forEach((b) => {
      let item = this.createBookmarkItem(b);
      this.items.update(item);
    });
  }

  setMusicItems(musicList) {
    this.items.clear();

    if (!musicList) return;

    musicList.forEach((m) => {
      let item = this.createMusicItem(m);
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
      id: music.timelineId,
      group: 'music',
      className: 'music',
      start: new Date(music.startCount),
      end: new Date(music.endCount + 1),
      // content: music.title || music.fileName, // change to desc
      music: music,
    };
  }

  createBookmarkItem(bookmark) {
    return {
      id: bookmark.timelineId || shortid.generate(),
      className: 'bookmark',
      group: 'bookmarks',
      start: new Date(bookmark.count),
      bookmark: bookmark,
    };
  }

  onMove(item, callback) {
    const self = this;
    if (item.group == 'music') {
      // update music item in drill when moved on timeline
      // each count is represented by a millisecond
      item.music.startCount = item.start.getMilliseconds();
      item.music.endCount = item.end.getMilliseconds() - 1;
      // notify that music changed
      self.eventService.notify(Events.musicChanged);
    }

    if (item.group == 'bookmarks') {
      item.bookmark.count = item.start.getMilliseconds();
    }
  }

  onRemove(item, callback) {
    let self = this;
    if (self.onRemoveCallback) {
      if (self.onRemoveCallback(item)) {
        callback(item); // remove
      } else {
        callback(null); // cancel removal
      }
    }
  }

  onContextMenu(props) {
    console.log('Right click!', props);
    props.event.preventDefault();
    const item = props.item ? this.items.get(props.item) : null;
    this.eventService.notify(Events.showTimelineContextMenu, {
      point: {
        left: props.event.pageX,
        top: props.event.pageY - 100,
      },
      item: item,
      count: props.time.getMilliseconds(),
    });
  }

  onDoubleClick(props) {
    if (props.time) {
      this.onDoubleClickBackground(props);
    }

    if (props.item) {
      this.onDoubleClickItem(props);
    }
  }

  onDoubleClickBackground(props) {
    const self = this;
    console.log(props);
    if (!props.time) return;
    let count = props.time.getMilliseconds();
    self.moveTo(count);
    self.setCurrentCount(count);
    if (self.onGoToCountCallback) {
      self.onGoToCountCallback(count);
    }
  }

  onDoubleClickItem(props) {
    const item = this.items.get(props.item);
    if (item.group == 'bookmarks') {
      this.eventService.notify(Events.showBookmarkDialog, {
        bookmark: item.bookmark,
      });
    }
  }

  itemTemplate(item, element, data) {
    const template = this.templates[item.group];
    return template(item, element, data);
  }

  musicItemTemplate(item, element, data) {
    const caption = item.music ? item.music.title || item.music.fileName : '';
    const html = `
            <i class="fa fa-music"></i>  <span>${caption}</span>
        `;
    return html;
  }

  bookmarkItemTemplate(item, element, data) {
    const caption = item.bookmark ? item.bookmark.name : '';
    const html = `
            <i class="fa fa-bookmark"></i>  <span>${caption}</span>
        `;
    return html;
  }
}

export default Timeline;
