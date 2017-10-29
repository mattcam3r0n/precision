import { Random } from 'meteor/random';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import MemberFactory from '/client/lib/drill/MemberFactory';
import StepFactory from '/client/lib/drill/StepFactory';
import FileSelector from './FileSelector';
import MemberSelection from './MemberSelection';
import ScriptBuilder from './ScriptBuilder';
import Action from './Action';

class AddMode {
    static get Block() {
        return 'BLOCK';
    }

    static get File() {
        return 'FILE';
    }
}

class DrillBuilder {
    constructor(drill) {
        this.drill = drill || {};
        this._addMode = AddMode.File; // default to FTL
        this.selectedMembers = [];
        this.selectedFiles = [];
    }

    set addMode(mode) {
        if (mode != AddMode.Block || mode != AddMode.File)
            return;

        this._addMode = mode;
    }

    get addMode() {
        return this._addMode;
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
    
    addStep(strideType, stepType, direction, deltaX, deltaY) {
        // var step = StepFactory.createStep(strideType, stepType, direction);

        // if (this.addMode == AddMode.File) {
        //     var files = this.selectedFiles;
        //     files.forEach(f => {
        //         f.addStep(step);
        //     });
        // } else {
        //     var members = this.selectedMembers;
        //     members.forEach(m => {
        //         m.script.push(step);
        //     });    
        // }

        var action = new Action({
            strideType: strideType,
            stepType: stepType,
            direction: direction,
            deltaX: deltaX,
            deltaY: deltaY
        });

        var members = this.getSelectedMembers();
        members.forEach(m => {
            ScriptBuilder.addActionAtCount(m, action, this.drill.count + 1);
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

        this.selection = new MemberSelection(members);

        // remove?
        this.selectedMembers = [...members];
        this.selectedFiles = this.getSelectedFiles();
    }

    selectAll() {
        if (!this.drill || !this.drill.members) return;

        this.drill.members.forEach(m => {
            m.isSelected = true;
        });

        // use member selection
        
        this.selectedMembers = [];
        this.selectedMembers.push(...this.drill.members);
        this.selectedFiles = this.getSelectedFiles();
    }

    deselectAll() {
        if (!this.drill || !this.drill.members) return;

        this.drill.members.forEach(m => {
            m.isSelected = false;
        });

        this.selectedMembers = [];
        this.selectedFiles = [];
    }

    getMemberSelection() {
        return new MemberSelection(this.getSelectedMembers());
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
