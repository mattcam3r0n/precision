import StepType from './StepType';
import StrideType from './StrideType';
import Events from './Events';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';

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

    play(cb, playLength, playMusic) {
        this.drillPlayer.play(() => {
            this.notifyDrillStateChanged();
            if (cb) cb();
        }, playLength, playMusic);
    }

    stop() {
        this.drillPlayer.stop();
    }

    goToBeginning() {
        this.drillPlayer.goToBeginning();
        this.notifyDrillStateChanged();
    }

    goToEnd() {
        this.drillPlayer.goToEnd();
        this.notifyDrillStateChanged();
    }

    goToCount(count) {
        this.drillPlayer.goToCount(count);
        this.notifyDrillStateChanged();
    }

    stepBackward() {
        this.drillPlayer.stepBackward();
        this.notifyDrillStateChanged();
    }

    stepForward() {
        this.drillPlayer.stepForward();
        this.notifyDrillStateChanged();
    }

    // Editing

    selectMembers(members) {
        this.drillBuilder.select(members);
        this.notifyMembersSelected();
        this.notifyDrillStateChanged();
    }

    selectAll() {
        this.drillBuilder.selectAll();
        this.notifyMembersSelected();
        this.notifyDrillStateChanged();
    }

    deselectAll() {
        this.drillBuilder.deselectAll();
        this.notifyMembersSelected();
        this.notifyDrillStateChanged();
    }

    getMemberSelection() {
        return this.drillBuilder.getMemberSelection();
    }

    deleteSelectedMembers() {
        this.drillBuilder.deleteSelectedMembers();
        this.notifyMembersAdded();
        this.notifyDrillStateChanged();
        this.save(true);
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

    deleteBackspace() {
        let deleteCount = this.drill.count;
        this.drillPlayer.stepBackward();
        this.drillBuilder.deleteBackspace(deleteCount);
        this.notifyDrillStateChanged();
        this.save();
    }

    addStep(direction, stepType, strideType, deltaX, deltaY) {
        stepType = stepType || StepType.Full;
        strideType = strideType || this.strideType;
        this.drillBuilder.addStep(strideType,
            stepType,
            direction,
            deltaX,
            deltaY);
        this.drillPlayer.stepForward();
        this.notifyDrillStateChanged();
        this.save();
    }

    addMemberSteps(member, steps, atCount) {
        atCount = atCount === undefined ? this.currentCount + 1 : atCount;
        for (let i = 0; i < steps.length; i++) {
            let count = atCount + i;
            let step = steps[i];
            this.drillBuilder.addMemberStep(member, step, count);
        }
        this.notifyDrillStateChanged();
        this.save();
    }

    addMemberStep(member, step, atCount) {
        atCount = atCount === undefined
            ? this.drillBuilder.currentCount + 1
            : atCount;
        this.drillBuilder.addMemberStep(member, step, atCount);
        this.notifyDrillStateChanged();
        this.save();
    }

    addCountermarch() {
        this.drillBuilder.addCountermarch();
        this.play(null, 3);
        this.notifyDrillStateChanged();
        this.save();
    }

    addMembers(members) {
        this.drillBuilder.addMembers(members);
        this.notifyMembersAdded();
        this.notifyDrillStateChanged();
        this.save();
    }

    save(forceSave) {
        if (!forceSave && !this.drill.isDirty) return;

        // throttle saves
        if (this.saveTimeout) {
            this.$timeout.cancel(this.saveTimeout);
        }

        this.saveTimeout = this.$timeout(() => this.appStateService.saveDrill()
            , 2000);
    }

    // Events

    notifyDrillStateChanged() {
        let memberSelection = this.drillBuilder.getMemberSelection();
        this.eventService.notify(Events.drillStateChanged, { memberSelection });
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
