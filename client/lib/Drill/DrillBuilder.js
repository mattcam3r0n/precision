import { Random } from 'meteor/random';
import StepType from '/client/lib/StepType';
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
            members: [],
            music: []
        };
    }

    addMembers(newMembers) {
        if (!this.drill.members)
            this.drill.members = [];

        this.drill.members.push(...newMembers);
        this.drill.isDirty = true;
    }

    deleteSelectedMembers() {
        if (!this.drill.members)
            return;

        this.getSelectedMembers().forEach(m => {
            let i = this.drill.members.indexOf(m);
            if (i > -1) {
                this.drill.members.splice(i, 1);
            }
        });

        this.drill.isDirty = true;
    }

    createMember(strideType, dir, point) {
        return MemberFactory.createMember(strideType, dir, point);
    }
    
    addStep(strideType, stepType, direction, deltaX, deltaY) {
        var members = this.getSelectedMembers();
        var defaultValue = (a, b) => a === null || a === undefined ? b : a;
        members.forEach(m => {
            var action = new Action({
                strideType: defaultValue(strideType, m.currentState.strideType),
                stepType: defaultValue(stepType, m.currentState.stepType),
                direction: defaultValue(direction, m.currentState.direction),
                deltaX: deltaX,
                deltaY: deltaY
            });
            ScriptBuilder.addActionAtCount(m, action, this.drill.count + 1);
        });

        this.drill.isDirty = true;
    }

    addCountermarch() {
        var members = this.getSelectedMembers();
        var isLeftTurn = this.drill.count % 2 == 0 ? true : false;
        
        members.forEach(m => {
            var currentDir = m.currentState.direction;
            var firstTurnDirection = isLeftTurn ? Direction.leftTurnDirection(currentDir) : Direction.rightTurnDirection(currentDir);
            var secondTurnDirection = isLeftTurn ? Direction.leftTurnDirection(firstTurnDirection) : Direction.rightTurnDirection(firstTurnDirection);

            var firstTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Half,
                direction: firstTurnDirection
            });
            ScriptBuilder.addActionAtCount(m, firstTurn, this.drill.count + 1);

            var secondTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Full,
                direction: secondTurnDirection
            });
            ScriptBuilder.addActionAtCount(m, secondTurn, this.drill.count + 3);
        });        

        this.drill.isDirty = true;
    }

    /**
     * Delete all state changes from current count forward
     */
    deleteForward() {
        var members = this.getSelectedMembers();
        members.forEach(m => {
            ScriptBuilder.deleteForward(m, this.drill.count);
        });

        this.drill.isDirty = true;        
    }

    /**
     * Backup one step and delete
     */
    deleteBackspace(deleteCount) {
        var members = this.getSelectedMembers();

        members.forEach(m => {
            ScriptBuilder.deleteBackspace(m, deleteCount - 1);
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

    hideUnselected() {
        this.drill.members.forEach(m => {
            if (m.isVisible === undefined) {
                m.isVisible = true;
            }
            if (!m.isSelected) {
                m.isVisible = false;
            }
        });
    }

    showAll() {
        this.drill.members.forEach(m => {
            m.isVisible = true;
        });
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
