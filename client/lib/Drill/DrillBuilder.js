import { Random } from 'meteor/random';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import MemberFactory from '/client/lib/drill/MemberFactory';

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
    }

    createMember(strideType, dir, point) {
        return MemberFactory.createMember(strideType, dir, point);
    }
    
    addStep(member, strideType, stepType, direction, deltaX, deltaY) {
        member.script.push(this.createScriptNode(ScriptNode(strideType, stepType, direction, deltaX, deltaY)));
    }

    createScriptNode(strideType, stepType, dir, dx, dy) {
        var scriptNode = {};
        //scriptNode.stepCount = 1; // always 1 for now
        scriptNode.strideType = strideType;
        scriptNode.stepType = stepType;
        scriptNode.direction = dir;

        var delta = StepDelta.getDelta(strideType, stepType, dir);
        scriptNode.deltaX = dx || delta.deltaX;
        scriptNode.deltaY = dy || delta.deltaY;
        return scriptNode;
    }
}

export default DrillBuilder;
