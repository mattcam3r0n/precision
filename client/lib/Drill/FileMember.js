import StepFactory from './StepFactory';
import StepType from '/client/lib/StepType';
import MemberPositionCalculator from './MemberPositionCalculator';

class FileMember {
    constructor(member) {
        this.member = member;
        this._following = null;
        this.followedBy = null;
    }

    get following() {
        return this._following;
    }

    set following(fm) {
        this._following = fm;
        this.stepsToLeader = this.getStepsToLeader();
    }

    addStep(step) {
        // TODO: still needed? use scriptbuilder?

        // if (this.queue.length > 0) {
        //     this.queue.push(step);
        //     step = this.queue.shift();
        // }
        // this.member.script.push(step);
        // return step;
    }

    getStepsToLeader() {
        let me = this.member;
        if (!this.following) {
            return 0;
        }
        let leader = this.following.member;
        let leaderPos = Object.assign({}, leader.currentState); // important! use copy of current state
        let myPos = me.currentState;
        let steps = 0;
        while (!this.arePositionsEqual(myPos, leaderPos)) {
            myPos = MemberPositionCalculator.stepForward(me, myPos);
            steps++;
            if (steps > 6) {
                return null;
            }
        }

        return steps;
    }

    interpolateStepsToLeader() {
        let queue = [];
        let leader = this.following.member;
        let deltaX = this.member.currentState.x - leader.currentState.x;
        let deltaY = this.member.currentState.y - leader.currentState.y;
        let steps = Math.abs(deltaX || deltaY);

        for (let i = 0; i < steps; i++) {
            let step = StepFactory.createStep(leader.currentState.strideType,
                StepType.Full, leader.currentState.direction);
            queue.push(step);
        }
        return queue;
    }

    arePositionsEqual(p1, p2) {
        return (p1.x == p2.x
            && p1.y == p2.y
            && p1.direction == p2.direction
        );
    }

}

export default FileMember;
