import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';

class DragStepCalculator {
    constructor(members) {
        this.members = members;
    }

    dispose() {}

    calculateSteps(rotationDirection, rotationAngle, counts) {
        let memberSteps = {};
        this.members.forEach((m) => {
            memberSteps[m.id] = this.calculateMemberSteps(m, rotationDirection, rotationAngle, counts); // eslint-disable-line max-len
        });
        return memberSteps;
    }

    calculateMemberSteps(member, rotationDirection, rotationAngle, counts) { // eslint-disable-line max-len
        let anglePerStep = rotationAngle / counts * Math.PI;
        let rotationFactor = rotationDirection === 'counter-clockwise' ? -1 : 1;
        let steps = [];
        let lastStep = member.currentState;
        for (let count = 1; count <= counts; count++) {
            let pos = this.calculateMemberPosition(member, count,
                rotationFactor, anglePerStep);
            let step = {
                strideType: member.currentState.strideType,
                stepType: StepType.DragStep,
                x: pos.x,
                y: pos.y,
                deltaX: pos.x - lastStep.x,
                deltaY: pos.y - lastStep.y,
                direction: Direction.normalizeDirection(pos.direction),
            };
            steps.push(step);
            lastStep = step;
        }
        // add one more step to tell them to continue it last state (normal steps)
        steps.push({
            strideType: member.currentState.strideType,
            stepType: StepType.Full,
            direction: Direction.normalizeDirection(lastStep.direction),
        });
        return steps;
    }

    calculateMemberPosition(member, count, rotationFactor, anglePerStep) {
        let dirAngle = this.degreesInRadians(member.currentState.direction);
        let newDirAngle = dirAngle + (anglePerStep * count * rotationFactor);
        let adjustment = 180; // rotationFactor < 0 ? 180 : 0;
        let direction = this.radiansInDegrees(newDirAngle) + adjustment;
        return {
            count: count,
            x: member.currentState.x,
            y: member.currentState.y,
            direction: Direction.normalizeDirection(direction),
        };
    }

    normalizeDirection(dir) {
        if (dir >= 0 && dir < 360) return dir;

        return dir - (Math.floor(dir / 360) * 360);
    }

    degreesInRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    radiansInDegrees(radians) {
        return ((radians * 180 / Math.PI) + 180);
    }
}

export default DragStepCalculator;
