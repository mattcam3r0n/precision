import StepType from '/client/lib/StepType';
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
        if (mode != AddMode.Block || mode != AddMode.File) {
            return;
        }

        this._addMode = mode;
    }

    get addMode() {
        return this._addMode;
    }


    createDrill() {
        return {
            name: 'New Drill',
            members: [],
            music: [],
        };
    }

    addMembers(newMembers) {
        if (!this.drill.members) {
            this.drill.members = [];
        }

        this.drill.members.push(...newMembers);
        this.drill.isDirty = true;
    }

    deleteSelectedMembers() {
        if (!this.drill.members) {
            return;
        }

        this.getSelectedMembers().forEach((m) => {
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
        let members = this.getSelectedMembers();
        let defaultValue = (a, b) => a === null || a === undefined ? b : a;
        members.forEach((m) => {
            let action = new Action({
                strideType: defaultValue(strideType, m.currentState.strideType),
                stepType: defaultValue(stepType, m.currentState.stepType),
                direction: defaultValue(direction, m.currentState.direction),
                deltaX: deltaX,
                deltaY: deltaY,
            });
            ScriptBuilder.addActionAtCount(m, action, this.drill.count + 1);
        });

        this.drill.isDirty = true;
    }

    addMemberStep(member, step, count) {
        count = count === undefined ? this.drill.count + 1 : count;
        let defaultValue = (a, b) => a === null || a === undefined ? b : a;
        let action = new Action({
            strideType: defaultValue(step.strideType,
                member.currentState.strideType),
            stepType: defaultValue(step.stepType,
                member.currentState.stepType),
            direction: defaultValue(step.direction,
                member.currentState.direction),
            deltaX: step.deltaX,
            deltaY: step.deltaY,
        });
        ScriptBuilder.addActionAtCount(member, action, count);

        this.drill.isDirty = true;
    }

    addCountermarch() {
        let members = this.getSelectedMembers();
        let isLeftTurn = this.drill.count % 2 == 0 ? true : false;

        members.forEach((m) => {
            let currentDir = m.currentState.direction;
            let firstTurnDirection = isLeftTurn
                ? Direction.leftTurnDirection(currentDir)
                : Direction.rightTurnDirection(currentDir);
            let secondTurnDirection = isLeftTurn
                ? Direction.leftTurnDirection(firstTurnDirection)
                : Direction.rightTurnDirection(firstTurnDirection);

            let firstTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Half,
                direction: firstTurnDirection,
            });
            ScriptBuilder.addActionAtCount(m, firstTurn, this.drill.count + 1);

            let secondTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Full,
                direction: secondTurnDirection,
            });
            ScriptBuilder.addActionAtCount(m, secondTurn, this.drill.count + 3);
        });

        this.drill.isDirty = true;
    }

    addLeftCountermarch() {
        let members = this.getSelectedMembers();
        // add an extra step if on odd count (right foot)
        let extraStep = !(this.drill.count % 2 === 0);
        let firstTurnCount = this.drill.count + 1 + (extraStep ? 1 : 0);
        let secondTurnCount = this.drill.count + 3 + (extraStep ? 1 : 0);
        members.forEach((m) => {
            let currentDir = m.currentState.direction;
            let firstTurnDirection = Direction.leftTurnDirection(currentDir);
            let secondTurnDirection = Direction
                .leftTurnDirection(firstTurnDirection);

            let firstTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Half,
                direction: firstTurnDirection,
            });
            ScriptBuilder.addActionAtCount(m, firstTurn, firstTurnCount);

            let secondTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Full,
                direction: secondTurnDirection,
            });
            ScriptBuilder.addActionAtCount(m, secondTurn, secondTurnCount);
        });

        this.drill.isDirty = true;
    }

    addRightCountermarch() {
        let members = this.getSelectedMembers();
        // add an extra step if on an even count (left foot)
        let extraStep = this.drill.count % 2 === 0;
        let firstTurnCount = this.drill.count + 1 + (extraStep ? 1 : 0);
        let secondTurnCount = this.drill.count + 3 + (extraStep ? 1 : 0);
        members.forEach((m) => {
            let currentDir = m.currentState.direction;
            let firstTurnDirection = Direction.rightTurnDirection(currentDir);
            let secondTurnDirection = Direction
                .rightTurnDirection(firstTurnDirection);

            let firstTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Half,
                direction: firstTurnDirection,
            });
            ScriptBuilder.addActionAtCount(m, firstTurn, firstTurnCount);

            let secondTurn = new Action({
                strideType: m.currentState.strideType,
                stepType: StepType.Full,
                direction: secondTurnDirection,
            });
            ScriptBuilder.addActionAtCount(m, secondTurn, secondTurnCount);
        });

        this.drill.isDirty = true;
    }

    /**
     * Delete all state changes from current count forward
     */
    deleteForward() {
        let members = this.getSelectedMembers();
        members.forEach((m) => {
            ScriptBuilder.deleteForward(m, this.drill.count);
        });

        this.drill.isDirty = true;
    }

    /**
     * Backup one step and delete
     * @param {number} deleteCount
     */
    deleteBackspace(deleteCount) {
        let members = this.getSelectedMembers();

        members.forEach((m) => {
            ScriptBuilder.deleteBackspace(m, deleteCount - 1);
        });

        this.drill.isDirty = true;
    }

    createScriptNode(strideType, stepType, dir, dx, dy) {
        return StepFactory.createStep(strideType, stepType, dir, dx, dy);
    }

    select(members) {
        if (!members) return;

        members.forEach((m) => {
            if (!m) return;
            m.isSelected = !m.isSelected;
        });
    }

    selectAll() {
        if (!this.drill || !this.drill.members) return;

        this.drill.members.forEach((m) => {
            m.isSelected = true;
        });
    }

    deselectAll() {
        if (!this.drill || !this.drill.members) return;

        this.drill.members.forEach((m) => {
            m.isSelected = false;
        });
    }

    hideUnselected() {
        this.drill.members.forEach((m) => {
            if (m.isVisible === undefined) {
                m.isVisible = true;
            }
            if (!m.isSelected) {
                m.isVisible = false;
            }
        });
    }

    showAll() {
        this.drill.members.forEach((m) => {
            m.isVisible = true;
        });
    }

    getMemberSelection() {
        return new MemberSelection(this.getSelectedMembers());
    }

    getSelectedMembers() {
        return this.drill.members.filter((m) => m.isSelected);
    }

    getFiles(members) {
        let fileSelector = new FileSelector(members);
        return fileSelector.findFiles();
    }

    getSelectedFiles() {
        return this.getFiles(this.getSelectedMembers());
    }
}

export default DrillBuilder;
