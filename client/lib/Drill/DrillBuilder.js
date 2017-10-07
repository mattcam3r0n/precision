import { Random } from 'meteor/random';
import StepDelta from '/client/lib/StepDelta';
import Direction from '/client/lib/Direction';
import MemberFactory from '/client/lib/drill/MemberFactory';
import StepFactory from '/client/lib/drill/StepFactory';

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
    
    addStep(members, strideType, stepType, direction, deltaX, deltaY) {
        members = members || this.drill.members;

        members.forEach(m => {
            let step = StepFactory.createStep(strideType, stepType, direction);
            m.script.push(step);
        });
    }

    createScriptNode(strideType, stepType, dir, dx, dy) {
        return StepFactory.createStep(strideType, stepType, dir, dx, dy);
    }
}

export default DrillBuilder;
