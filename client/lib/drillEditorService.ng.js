import StepType from './StepType';
import StrideType from './StrideType';
import Direction from './Direction';
import Events from './Events';
import DrillBuilder from '/client/lib/drill/DrillBuilder';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import { appendFile } from 'fs';

class DrillEditorService {
    constructor($rootScope, $timeout, appStateService) {
        this.$rootScope = $rootScope.$new(true);
        this.$timeout = $timeout;
        this.appStateService = appStateService;
    }

    setDrill(d) {
        this.drill = d;
        this.drillPlayer = new DrillPlayer(this.drill);
        this.drillBuilder = new DrillBuilder(this.drill);

        this.goToBeginning();
        this.deselectAll();
        this.showAll();

        this.notifyDrillStateChanged();
    }

    setTempo(tempo) {
        if (this.drillPlayer)
            this.drillPlayer.setTempo(tempo);
    }

    // Playback

    play() {
        this.drillPlayer.play(this.notifyDrillStateChanged.bind(this));
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
        var deleteCount = this.drill.count;
        this.drillPlayer.stepBackward();
        this.drillBuilder.deleteBackspace(deleteCount);
        this.notifyDrillStateChanged();
        this.save();
    }

    addStep(direction, stepType, strideType) {
        stepType = stepType || StepType.Full;
        strideType = strideType || StrideType.SixToFive;
        this.drillBuilder.addStep(strideType, stepType, direction);
        this.drillPlayer.stepForward();
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
            this.$timeout.cancel(this.saveTimeout)
        }

        this.saveTimeout = this.$timeout(() => this.appStateService.saveDrill(), 2000);
    }

    // Events

    subscribeDrillStateChanged(cb) {
        var unsubscribe = this.$rootScope.$on(Events.drillStateChanged, cb);
        return unsubscribe;
    }

    notifyDrillStateChanged() {
        var memberSelection = this.drillBuilder.getMemberSelection();
        this.$rootScope.$broadcast(Events.drillStateChanged, { memberSelection });
    }

    subscribeMembersSelected(cb) {
        var unsubscribe = this.$rootScope.$on(Events.membersSelected, cb);
        return unsubscribe;
    }

    notifyMembersSelected() {
        var memberSelection = this.drillBuilder.getMemberSelection();
        this.$rootScope.$broadcast(Events.membersSelected, { memberSelection });  
    }

    subscribeMembersAdded(cb) {
        var unsubscribe = this.$rootScope.$on(Events.membersAdded, cb);
        return unsubscribe;
    }

    notifyMembersAdded() {
        this.$rootScope.$broadcast(Events.membersAdded);
    }
}


angular.module('drillApp')
    .service('drillEditorService', DrillEditorService);
