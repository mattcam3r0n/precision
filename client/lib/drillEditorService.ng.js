import StepType from './StepType';
import StrideType from './StrideType';
import Events from './Events';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import UndoManager from '/client/lib/UndoManager';

class DrillEditorService {
    constructor($timeout, appStateService, eventService) {
        this.$timeout = $timeout;
        this.appStateService = appStateService;
        this.eventService = eventService;
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
        if (this.drillPlayer) {
            this.drillPlayer.setTempo(tempo);
        }
    }

    get currentCount() {
        return this.drill.count;
    }

    // Playback

    play(cb, playLength, playMusic, playMetronome) {
        this.drillPlayer.play(() => {
            this.notifyDrillStateChanged();
            if (cb) cb();
        }, playLength, playMusic, playMetronome);
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

    deselectAll() {
        this.drillBuilder.deselectAll();
        this.notifyMembersSelected();
        // this.notifyDrillStateChanged();
    }

    getMemberSelection() {
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
            label: 'Add Members',
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
            label: 'Delete Members',
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

    showPaths() {
        // TODO
    }

    showAll() {
        this.drillBuilder.showAll();
        this.notifyDrillStateChanged();
    }

    deleteForward() {
        this.drillBuilder.deleteForward();
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

    restoreSteps(memberSteps) {
        this.drillBuilder.restoreMemberSteps(memberSteps);
        this.save();
    }

    makeUndoable(label, members, count, counts, action, undo, redo) {
        // save the steps prior to change
        const savedSteps = this.saveSteps(members, count, count + counts);
        // do the change
        action();

        undo = undo || (() => {
            this.restoreSteps(savedSteps);
            this.goToCount(count - 1);
        });

        redo = redo || (() => {
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
        const savedSteps = this.drillBuilder
                            .getMemberSteps(members, fromCount, toCount);
        return savedSteps;
    }

    addDragSteps(members, memberSteps, counts) {
        members = members || this.drillBuilder.getSelectedMembers();
        const count = this.drill.count + 1;
        this.makeUndoable(
            'Drag Step',
            members,
            count,
            counts + 1,
            () => {
                this.doAddDragSteps(members, memberSteps, counts);
            }
        );
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
        atCount = atCount === undefined
            ? this.drillBuilder.currentCount + 1
            : atCount;
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
        this.makeUndoable(
            'Left Countermarch',
            members,
            count,
            counts,
            () => {
                this.doAddLeftCountermarch(members, counts);
            }
        );
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
        this.makeUndoable(
            'Right Countermarch',
            members,
            count,
            counts,
            () => {
                this.doAddRightCountermarch(members, counts);
            }
        );
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
        this.makeUndoable(
            'Left Face',
            members,
            count,
            2,
            () => {
                this.doAddLeftFace(members);
            }
        );
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
        this.makeUndoable(
            'Right Face',
            members,
            count,
            2,
            () => {
                this.doAddRightFace(members);
            }
        );
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
        this.makeUndoable(
            'About Face (2 ct)',
            members,
            count,
            2,
            () => {
                this.doAddAboutFace2(members);
            }
        );
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
        this.makeUndoable(
            'About Face (3 ct)',
            members,
            count,
            3,
            () => {
                this.doAddAboutFace3(members);
            }
        );
    }

    doAddAboutFace3(members) {
        this.drillBuilder.addAboutFace3(members);
        this.play(null, 3);
        this.notifyDrillStateChanged();
        this.save();
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

    notifyMembersSelected() {
        let memberSelection = this.drillBuilder.getMemberSelection();
        this.eventService.notify(Events.membersSelected, { memberSelection });
    }

    notifyMembersAdded() {
        this.eventService.notify(Events.membersAdded);
    }
}


angular.module('drillApp')
    .service('drillEditorService', DrillEditorService);
