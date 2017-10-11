import { Random } from 'meteor/random';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import MemberFactory from '/client/lib/drill/MemberFactory';
import StepFactory from '/client/lib/drill/StepFactory';
import FileSelector from './FileSelector';

class DrillBuilder {
    constructor(drill) {
        this.drill = drill || {};
    }

    createDrill() {
        return {
            name: 'New Drill',
            members: []
        };
    }

    addMembers(newMembers) {
        if (!this.drill.members)
            this.drill.members = [];

        this.drill.members.push(...newMembers);
        this.drill.isDirty = true;
    }

    createMember(strideType, dir, point) {
        return MemberFactory.createMember(strideType, dir, point);
    }
    
    addStep(members, strideType, stepType, direction, deltaX, deltaY) {
        members = members || this.drill.members;

        members.forEach(m => {
            let step = StepFactory.createStep(strideType, stepType, direction);
            m.script.push(step);
        });
        this.drill.isDirty = true;
    }

    createScriptNode(strideType, stepType, dir, dx, dy) {
        return StepFactory.createStep(strideType, stepType, dir, dx, dy);
    }

    select(members) {
        if (!members) return;
        members.forEach(m => {
            if (!m) return;
            m.isSelected = !m.isSelected;
        });
    }

    selectAll() {
        if (!this.drill || !this.drill.members) return;

        this.drill.members.forEach(m => {
            m.isSelected = true;
        });
    }

    deselectAll() {
        if (!this.drill || !this.drill.members) return;

        this.drill.members.forEach(m => {
            m.isSelected = false;
        });
    }

    getSelectedMembers() {
        return this.drill.members.filter(m => m.isSelected);
    }

    getFiles(members) {
        var fileSelector = new FileSelector(members);
        return fileSelector.findFiles();
    }

    getSelectedFiles() {
        return this.getFiles(this.getSelectedMembers());
    }
}

export default DrillBuilder;
