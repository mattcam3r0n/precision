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

    // the following are a hack used by the minorTickLabels func to
    // keep track of the top/bottom axis on timeline
    this.tick = 0;
    this.topAxis = true;

    this.initTimeline();
  }

  initTimeline() {
    let container = document.getElementById(this.containerId);

    let options = {
      height: '95px',
      // zoomMin: 1000,                    // 1 second
      // zoomMax: 1000 * 60 * 60 * 24,     // 1 day
      verticalScroll: true,
      orientation: {
        axis: 'both',
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
      maxMinorChars: 7,
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
        minorLabels: this.axisLabelFormatter.bind(this),
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

  axisLabelFormatter(date, scale, step) {
    // console.log(new Date(date).getTime(), tick, scale, step);
    const count = new Date(date).getTime();
    if (this.tick < count) {
      this.tick = count;
    } else {
      // flip to other axis
      this.topAxis = !this.topAxis;
      this.tick = 0;
    }
    let topLabel = count;
    if (this.drillSchedule && this.drillSchedule.steps[count - 1]) {
      const timeInSeconds = this.drillSchedule.steps[count - 1].time;
      const time = new Date(null);
      time.setMilliseconds(timeInSeconds * 1000);
      topLabel = time.toISOString().substring(14, 21);
    }
    // return count + (topLabel ? ' (' + topLabel + ')' : '');
    return this.topAxis ? topLabel : count;
    // return new Date(date).getTime();
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
    // reset axis-related variables
    this.topAxis = true;
    this.tick = count; // must set to count we're moving to in order to prevent flip/flopping

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

  setDrillSchedule(schedule) {
    this.drillSchedule = schedule;
    this.timeline.redraw();
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
    if (music.type == 'tempo') return this.createTempoItem(music);
    return {
      id: music.timelineId,
      group: 'music',
      className: 'music',
      start: new Date(music.startCount),
      end: new Date(music.endCount + 1),
      music: music,
    };
  }

  createTempoItem(item) {
    return {
      id: item.timelineId,
      group: 'music',
      className: 'tempo',
      start: new Date(item.startCount),
      end: new Date(item.endCount + 1),
      music: item, // tempo items are special music items
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
      return;
    }
    if (item.group == 'music' && item.music && item.music.type == 'tempo') {
      this.eventService.notify(Events.showTempoDialog, {
        tempoItem: item.music,
      });
    }
  }

  itemTemplate(item, element, data) {
    const template = this.templates[item.group];
    return template(item, element, data);
  }

  musicItemTemplate(item, element, data) {
    if (item.music && item.music.type == 'tempo') {
      return this.tempoItemTemplate(item, element, data);
    }
    let caption = item.music ? item.music.title || item.music.fileName : '';
    caption += ' (' + item.music.tempo + ' BPM)';
    const html = `
            <i class="fa fa-music"></i>  <span>${caption}</span>
        `;
    return html;
  }

  tempoItemTemplate(item, element, data) {
    const caption = item.music.tempo + ' BPM';
    const html = `
            <i class="far fa-clock-o"></i>  <span>${caption}</span>
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
