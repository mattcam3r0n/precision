import StepType from './StepType';
import StrideType from './StrideType';
import Events from './Events';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import UndoManager from '/client/lib/UndoManager';
import PositionMap from './drill/PositionMap';
import Block from './drill/Block';
import Direction from '/client/lib/Direction';

import Illinois from './drill/maneuvers/Illinois';
import Countermarch from './drill/maneuvers/Countermarch';
import ToTheRears from './drill/maneuvers/ToTheRears';
import TexasTurn from './drill/maneuvers/TexasTurn';
import Column from './drill/maneuvers/Column';

class DrillEditorService {
  constructor(
    $timeout,
    appStateService,
    eventService,
    confirmationDialogService
  ) {
    this.$timeout = $timeout;
    this.appStateService = appStateService;
    this.eventService = eventService;
    this.confirmationDialogService = confirmationDialogService;
  }

  setDrill(d) {
    this.drill = d;
    this.drillPlayer = new DrillPlayer(this.drill, this.eventService);
    this.drillBuilder = new DrillBuilder(this.drill);

    this.goToBeginning();
    this.deselectAll();
    this.showAll();

    this.notifyDrillStateChanged();
  }

  get strideType() {
    return this._strideType || StrideType.SixToFive;
  }

  set strideType(value) {
    this._strideType = value;
    this.notifyStrideTypeChanged();
  }

  setTempo(tempo) {
    if (!this.drill) return;
    this.drill.tempo = Number(tempo) || 120;
    if (this.drillPlayer) {
      this.drillPlayer.setTempo(tempo);
    }
  }

  get currentCount() {
    return this.drill.count;
  }

  // Playback

  play(cb, playLength, playMusic, playMetronome) {
    this.drillPlayer.play(
      () => {
        this.notifyDrillStateChanged();
        if (cb) cb();
      },
      playLength,
      playMusic,
      playMetronome
    );
  }

  stop() {
    this.drillPlayer.stop();
  }

  goToBeginning() {
    if (this.drillPlayer.isPlaying) return;
    this.drillPlayer.goToBeginning();
    this.notifyDrillStateChanged();
  }

  goToEnd() {
    if (this.drillPlayer.isPlaying) return;
    this.drillPlayer.goToEnd();
    this.notifyDrillStateChanged();
  }

  goToCount(count) {
    this.drillPlayer.goToCount(count);
    this.notifyDrillStateChanged();
  }

  stepBackward() {
    if (this.drillPlayer.isPlaying) return;
    this.drillPlayer.stepBackward();
    this.notifyDrillStateChanged();
  }

  stepForward() {
    if (this.drillPlayer.isPlaying) return;
    this.drillPlayer.stepForward();
    this.notifyDrillStateChanged();
  }

  // Editing

  selectMembers(members) {
    this.drillBuilder.select(members);
    this.notifyMembersSelected();
    // this.notifyDrillStateChanged();
  }

  selectAll() {
    this.drillBuilder.selectAll();
    this.notifyMembersSelected();
    // this.notifyDrillStateChanged();
  }

  selectXandO() {
    const selected = this.drillBuilder.getMemberSelection();
    const positionMap = new PositionMap(selected.members);
    positionMap.distinctXs.forEach((x, i) => {
      positionMap.distinctYs.forEach((y, j) => {
        const m = positionMap.getMemberAtPosition(x, y);
        if (m) {
          if (i % 2 == 0) {
            m.isSelected = j % 2 == 0 ? true : false;
          } else {
            m.isSelected = j % 2 == 0 ? false : true;
          }
        }
      });
    });
    this.notifyMembersSelected();
  }

  selectAlternatingFiles() {
    const selected = this.drillBuilder.getMemberSelection();
    const block = new Block(selected.members);
    block.positionMap.distinctXs.forEach((x, i) => {
      block.positionMap.distinctYs.forEach((y, j) => {
        const m = block.positionMap.getMemberAtPosition(x, y);
        if (m) {
          if ([Direction.N, Direction.S].includes(block.getBlockDirection())) {
            m.isSelected = i % 2 == 0 ? true : false;
          } else {
            m.isSelected = j % 2 == 0 ? true : false;
          }
        }
      });
    });
    this.notifyMembersSelected();
  }

  selectAlternatingRanks() {
    const selected = this.drillBuilder.getMemberSelection();
    const block = new Block(selected.members);
    block.positionMap.distinctXs.forEach((x, i) => {
      block.positionMap.distinctYs.forEach((y, j) => {
        const m = block.positionMap.getMemberAtPosition(x, y);
        if (m) {
          if ([Direction.N, Direction.S].includes(block.getBlockDirection())) {
            m.isSelected = j % 2 == 0 ? true : false;
          } else {
            m.isSelected = i % 2 == 0 ? true : false;
          }
        }
      });
    });
    this.notifyMembersSelected();
  }

  deselectAll() {
    this.drillBuilder.deselectAll();
    this.notifyMembersSelected();
    // this.notifyDrillStateChanged();
  }

  getMemberSelection() {
    if (!this.drillBuilder) return null;
    return this.drillBuilder.getMemberSelection();
  }

  addMembers(members, skipUndo) {
    const self = this;

    self.drillBuilder.addMembers(members);
    self.notifyMembersAdded();
    self.notifyDrillStateChanged();
    self.save();

    if (skipUndo) return;
    UndoManager.add({
      label: 'Add Marchers',
      undo: () => {
        self.deleteMembers(members, true);
      },
      redo: () => {
        self.addMembers(members, true);
      },
    });
  }

  deleteMembers(members, skipUndo) {
    const self = this;
    self.drillBuilder.deleteMembers(members);
    self.notifyMembersAdded();
    self.notifyDrillStateChanged();
    self.save(true);

    if (skipUndo) return;
    UndoManager.add({
      label: 'Delete Marchers',
      undo: () => {
        self.addMembers(members, true);
      },
      redo: () => {
        self.deleteMembers(members, true);
      },
    });
  }

  deleteSelectedMembers() {
    const self = this;
    self.deleteMembers(self.drillBuilder.getSelectedMembers());
  }

  hideUnselected() {
    this.drillBuilder.hideUnselected();
    this.notifyDrillStateChanged();
  }

  // preview paths for a set of members and a set of scripts
  // that have not been applied yet.
  previewFootprints(members, memberSequences, counts) {
    // create new member objects with the current state and the sequences to preview
    // as the script
    const previewMembers = members.map((m) => {
      return {
        id: m.id,
        initialState: m.initialState, // treat current state as initial
        currentState: m.currentState,
        script: m.script.slice(),
        // [m.currentState, ...memberSequences.getSequence(m.id)],
      };
    });
    this.drillBuilder.addSequences(
      previewMembers,
      memberSequences,
      this.drill.count + 1
    );
    this.showFootprints(previewMembers, counts);
  }

  // preview footprints for a set of members
  showFootprints(members, counts) {
    members = members || this.drillBuilder.getSelectedMembers();
    const pointSet = this.drillBuilder.getFootprintPoints(members, counts);
    this.eventService.notify(Events.showFootprints, { pointSet: pointSet });
    this.notifyDrillStateChanged();
  }

  clearFootprints() {
    this.eventService.notify(Events.clearFootprints);
    this.notifyDrillStateChanged();
  }

  showAll() {
    this.drillBuilder.showAll();
    this.notifyDrillStateChanged();
  }

  deleteForward() {
    this.confirmationDialogService
      .show({
        heading: 'Delete Forward',
        message:
          'This will delete all counts for the selected marchers from the current count forward. Click Delete to proceed.',
        confirmText: 'Delete',
      })
      .then((result) => {
        if (result.confirmed) {
          this.drillBuilder.deleteForward();
          this.notifyDrillStateChanged();
          this.save();
        }
      });
  }

  deleteCount() {
    const count = this.drill.count;
    this.drillPlayer.stepBackward();
    this.drillBuilder.deleteCount(count);
    this.notifyDrillStateChanged();
    this.save();
  }

  clearCount() {
    const count = this.drill.count;
    this.drillPlayer.stepBackward();
    this.drillBuilder.clearCount(count);
    this.notifyDrillStateChanged();
    this.save();
  }

  deleteBackspace(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count;
    const counts = 1;
    this.makeUndoable(
      'Delete Step',
      members,
      count,
      counts,
      () => {
        this.doDeleteBackspace(this.drill.count);
      },
      null,
      () => {
        this.goToCount(count);
        this.doDeleteBackspace(this.drill.count);
      }
    );
  }

  doDeleteBackspace(count) {
    // let deleteCount = this.drill.count;
    this.drillPlayer.stepBackward();
    this.drillBuilder.deleteBackspace(count);
    this.notifyDrillStateChanged();
    this.save();
  }

  insertStep(step, members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    const counts = 1;
    this.makeUndoable(
      'Insert Step', // TODO: generate a better label? flank, halt, etc?
      members,
      count,
      counts,
      () => {
        this.doInsertStep(step, members);
      },
      () => {
        this.goToCount(count);
        this.deleteCount();
      }
    );
  }

  doInsertStep(step, members) {
    this.drillBuilder.insertStep(members, step);
    this.drillPlayer.stepForward();
    this.notifyDrillStateChanged();
    this.save();
  }

  addStep(step, members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    const counts = 1;
    this.makeUndoable(
      'Add Step', // TODO: generate a better label? flank, halt, etc?
      members,
      count,
      counts,
      () => {
        this.doAddStep(step, members);
      }
    );
  }

  doAddStep(step, members) {
    step.stepType = step.stepType || StepType.Full;
    step.strideType = step.strideType || this.strideType;

    this.drillBuilder.addStep(members, step);
    this.drillPlayer.stepForward();
    this.notifyDrillStateChanged();
    this.save();
  }

  reverseStep(countToReverse, countToAdd, members) {
    countToReverse = countToReverse || this.drill.count;
    countToAdd = countToAdd || this.drill.count;
    members = members || this.drillBuilder.getSelectedMembers();
    const counts = 1;
    this.makeUndoable(
      'Reverse Step', // TODO: generate a better label? flank, halt, etc?
      members,
      countToAdd,
      counts,
      () => {
        this.doReverseStep(countToReverse, countToAdd, members);
      }
    );
  }

  doReverseStep(countToReverse, countToAdd, members) {
    this.drillBuilder.reverseStep(members, countToReverse, countToAdd);
    this.drillPlayer.stepForward();
    this.notifyDrillStateChanged();
    this.save();
  }

  reverseSteps(count, counts, skip, members) {
    count = count || this.drill.count;
    counts = counts || 1;
    skip = skip || 0;
    members = members || this.drillBuilder.getSelectedMembers();

    this.drillBuilder.reverseSteps(members, count, counts, skip);
    this.drillPlayer.stepForward();
    this.notifyDrillStateChanged();
    this.save();
  }

  restoreSteps(memberSteps) {
    this.drillBuilder.restoreMemberSteps(memberSteps);
    this.save();
  }

  makeUndoable(label, members, count, counts, action, undo, redo) {
    // save the steps prior to change
    const savedSteps = this.saveSteps(members, count, count + counts);
    // do the change
    action();

    undo =
      undo ||
      (() => {
        this.restoreSteps(savedSteps);
        this.goToCount(count - 1);
      });

    redo =
      redo ||
      (() => {
        this.goToCount(count - 1);
        action();
      });

    // add action to undo/redo
    UndoManager.add({
      label: label + ' at count ' + count,
      undo: undo,
      redo: redo,
    });
  }

  saveSteps(members, fromCount, toCount) {
    const savedSteps = this.drillBuilder.getMemberSteps(
      members,
      fromCount,
      toCount
    );
    return savedSteps;
  }

  addDragSteps(members, memberSteps, counts) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    this.makeUndoable('Drag Step', members, count, counts + 1, () => {
      this.doAddDragSteps(members, memberSteps, counts);
    });
  }

  doAddDragSteps(members, memberSteps, counts) {
    // TODO: push addMemberSteps etc into drillbuilder?
    members.forEach((member) => {
      let steps = memberSteps[member.id];
      this.addMemberSteps(member, steps);
    });

    this.save(true);
    this.notifyDrillStateChanged();
  }

  addPinwheel(mode, members, memberSteps, counts) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    this.makeUndoable(
      mode == 'gate' ? 'Gate' : 'Pinwheel',
      members,
      count,
      counts + 1,
      () => {
        this.doAddPinwheel(members, memberSteps, counts);
      }
    );
  }

  doAddPinwheel(members, memberSteps, counts) {
    // TODO: push addMemberSteps etc into drillbuilder?
    members.forEach((member) => {
      let steps = memberSteps[member.id];
      this.addMemberSteps(member, steps);
    });

    this.save(true);
    this.notifyDrillStateChanged();
  }

  addMemberSteps(member, steps, atCount) {
    atCount = atCount === undefined ? this.currentCount + 1 : atCount;
    for (let i = 0; i < steps.length; i++) {
      let count = atCount + i;
      let step = steps[i];
      this.drillBuilder.addMemberStep(member, step, count);
    }
    // This function is used in loops, so don't call drill state change.
    // The caller needs to call it when done.
    // this.notifyDrillStateChanged();
    this.save();
  }

  addMemberStep(member, step, atCount) {
    atCount =
      atCount === undefined ? this.drillBuilder.currentCount + 1 : atCount;
    this.drillBuilder.addMemberStep(member, step, atCount);
    // This function is used in loops, so don't call drill state change.
    // The caller needs to call it when done.
    // this.notifyDrillStateChanged();
    this.save();
  }

  addCountermarch() {
    this.drillBuilder.addCountermarch();
    this.play(null, 3);
    this.notifyDrillStateChanged();
    this.save();
  }

  addLeftCountermarch(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const counts = this.drill.count % 2 === 0 ? 3 : 4;
    const count = this.drill.count + 1;
    this.makeUndoable('Left Countermarch', members, count, counts, () => {
      this.doAddLeftCountermarch(members, counts);
    });
  }

  doAddLeftCountermarch(members, counts) {
    this.drillBuilder.addLeftCountermarch(members);
    this.play(null, counts);
    this.notifyDrillStateChanged();
    this.save();
  }

  addRightCountermarch(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    const counts = this.drill.count % 2 === 0 ? 4 : 3;
    this.makeUndoable('Right Countermarch', members, count, counts, () => {
      this.doAddRightCountermarch(members, counts);
    });
  }

  doAddRightCountermarch(members, counts) {
    this.drillBuilder.addRightCountermarch(members);
    this.play(null, counts);
    this.notifyDrillStateChanged();
    this.save();
  }

  addLeftFace(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    this.makeUndoable('Left Face', members, count, 2, () => {
      this.doAddLeftFace(members);
    });
  }

  doAddLeftFace(members) {
    this.drillBuilder.addLeftFace(members);
    this.play(null, 2);
    this.notifyDrillStateChanged();
    this.save();
  }

  addRightFace(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    this.makeUndoable('Right Face', members, count, 2, () => {
      this.doAddRightFace(members);
    });
  }

  doAddRightFace(members) {
    this.drillBuilder.addRightFace(members);
    this.play(null, 2);
    this.notifyDrillStateChanged();
    this.save();
  }

  addAboutFace2(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    this.makeUndoable('About Face (2 ct)', members, count, 2, () => {
      this.doAddAboutFace2(members);
    });
  }

  doAddAboutFace2(members) {
    this.drillBuilder.addAboutFace2(members);
    this.play(null, 2);
    this.notifyDrillStateChanged();
    this.save();
  }

  addAboutFace3(members) {
    members = members || this.drillBuilder.getSelectedMembers();
    const count = this.drill.count + 1;
    this.makeUndoable('About Face (3 ct)', members, count, 3, () => {
      this.doAddAboutFace3(members);
    });
  }

  doAddAboutFace3(members) {
    this.drillBuilder.addAboutFace3(members);
    this.play(null, 3);
    this.notifyDrillStateChanged();
    this.save();
  }

  undo() {
    UndoManager.undo();
  }

  redo() {
    UndoManager.redo();
  }

  zoomIn() {
    this.eventService.notify(Events.zoomIn);
  }

  zoomOut() {
    this.eventService.notify(Events.zoomOut);
  }

  zoomToFit() {
    this.eventService.notify(Events.sizeToFit);
  }

  save(forceSave) {
    if (!forceSave && !this.drill.isDirty) return;

    // throttle saves
    if (this.saveTimeout) {
      this.$timeout.cancel(this.saveTimeout);
    }

    this.saveTimeout = this.$timeout(() => {
      this.appStateService.saveDrill();
    }, 10000);
  }

  splitTrack(splitCount, track) {
    this.drillBuilder.splitTrack(splitCount, track);
    // this.save();
    this.eventService.notify(Events.audioClipAdded);
  }

  addTempo() {
    // this.drill.music.push({
    //   type: 'tempo',
    //   startCount: 9,
    //   endCount: 12,
    //   tempo: 112,
    // });
    // this.eventService.notify(Events.audioClipAdded);
    this.eventService.notify(Events.showTempoDialog);
  }

  countermarch(options) {
    const members = this.drillBuilder.getSelectedMembers();
    const countermarch = new Countermarch(members);
    const memberSeqs = countermarch.generate(options);
    const count = this.drill.count + 1;

    this.makeUndoable(
      'Countermarch Maneuver',
      members,
      count,
      memberSeqs.maxLength,
      () => {
        this.drillBuilder.addSequences(
          members,
          memberSeqs,
          this.drill.count + 1
        );
        this.notifyDrillStateChanged();
        this.save();
      }
    );
  }

  toTheRears(options) {
    const members = this.drillBuilder.getSelectedMembers();
    const toTheRears = new ToTheRears(members);
    const memberSeqs = toTheRears.generate(options);
    const count = this.drill.count + 1;

    this.makeUndoable(
      'To-The-Rears Maneuver',
      members,
      count,
      memberSeqs.maxLength,
      () => {
        this.drillBuilder.addSequences(
          members,
          memberSeqs,
          this.drill.count + 1
        );
        this.notifyDrillStateChanged();
        this.save();
      }
    );
  }

  illinois() {
    const members = this.drillBuilder.getSelectedMembers();
    const illinois = new Illinois(members);
    const memberSeqs = illinois.generate();
    const count = this.drill.count + 1;

    this.makeUndoable(
      'Illinois Maneuver',
      members,
      count,
      memberSeqs.maxLength,
      () => {
        this.drillBuilder.addSequences(
          members,
          memberSeqs,
          this.drill.count + 1
        );
        this.notifyDrillStateChanged();
        this.save();
      }
    );
  }

  texasTurn(options) {
    const members = this.drillBuilder.getSelectedMembers();
    const texasTurn = new TexasTurn(members);
    const memberSeqs = texasTurn.generate(options);
    const count = this.drill.count + 1;

    this.makeUndoable(
      'Texas Turn Maneuver',
      members,
      count,
      memberSeqs.maxLength,
      () => {
        this.drillBuilder.addSequences(
          members,
          memberSeqs,
          this.drill.count + 1
        );
        this.notifyDrillStateChanged();
        this.save();
      }
    );
    texasTurn.generate();
  }

  column(options) {
    const members = this.drillBuilder.getSelectedMembers();
    const column = new Column(members);
    const memberSeqs = column.generate(options);
    const count = this.drill.count + 1;

    this.makeUndoable(
      'Column Maneuver',
      members,
      count,
      memberSeqs.maxLength,
      () => {
        this.drillBuilder.addSequences(
          members,
          memberSeqs,
          this.drill.count + 1
        );
        this.notifyDrillStateChanged();
        this.save();
      }
    );
    column.generate();
  }

  blurActiveElement() {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }

  // Events

  notifyDrillStateChanged() {
    // TODO: is memberselection needed for this event? doesn't seem to be used anywhere?
    // let memberSelection = this.drillBuilder.getMemberSelection();
    // this.eventService.notify(Events.drillStateChanged, { memberSelection });
    this.eventService.notify(Events.drillStateChanged);
  }

  notifyStrideTypeChanged() {
    let strideType = this.strideType;
    this.eventService.notify(Events.strideTypeChanged, { strideType });
  }

  notifyMusicChanged() {
    this.eventService.notify(Events.musicChanged);
  }

  notifyMembersSelected() {
    let memberSelection = this.drillBuilder.getMemberSelection();
    this.eventService.notify(Events.membersSelected, { memberSelection });
  }

  notifyMembersAdded() {
    this.eventService.notify(Events.membersAdded);
  }
}

angular.module('drillApp').service('drillEditorService', DrillEditorService);
