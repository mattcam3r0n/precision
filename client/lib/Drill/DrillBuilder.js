import { Random } from 'meteor/random';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';

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
        var newMember = {};
        newMember.id = Random.id();
        newMember.initialState = {
            x: point.x,
            y: point.y,
            direction: dir,
            strideType: strideType
        };
		newMember.currentState = {
			x: point.x,
			y: point.y,
            direction: dir,
            strideType: strideType,
			count: 0
        };
        newMember.script = [];
        
        return newMember;
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
