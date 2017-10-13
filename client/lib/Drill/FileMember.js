import StepFactory from './StepFactory';
import StepType from '/client/lib/StepType';
import MemberPositionCalculator from './MemberPositionCalculator';

class FileMember {
    constructor(member) {
        this.member = member;
        this._following = null;
        this.followedBy = null;
        this.queue = [];
        //this.populateQueue();
    }

    get following() {
        return this._following;
    }

    set following(fm) {
        this._following = fm;
        this.populateQueue();
    }

    addStep(step) {
        if (this.queue.length > 0) {
            this.queue.push(step);
            step = this.queue.shift();
        }
        this.member.script.push(step);
        return step;
    }

    populateQueue() {
        this.queue = [];

        if (!this.following) return;

        var steps = this.getStepsToLeader();
        this.queue = steps;
    }

    getStepsToLeader() {
        var me = this.member;
        var leader = this.following.member;
        var leaderPos = Object.assign({}, leader.currentState); // important! use copy of current state
        var myPos = me.currentState;

        var count = leader.currentState.count;
        var stepQueue = [];
        while (!this.arePositionsEqual(myPos, leaderPos)){
            stepQueue.unshift(leader.script[count - 1]); // add to front of queue, because we're going backwards
            leaderPos = MemberPositionCalculator.stepBackward(leader, leaderPos); 
            count--;
            if (stepQueue.length > 6) {
                stepQueue = null;
                break; // opt out if not within 6 steps?? return null? or empty?     
            }
        }

        if (!stepQueue)
            return this.interpolateStepsToLeader();

        return stepQueue;
    }

    interpolateStepsToLeader() {

        var queue = []
        var leader = this.following.member;
        var deltaX = this.member.currentState.x - leader.currentState.x;
        var deltaY = this.member.currentState.y - leader.currentState.y;
        var steps = Math.abs(deltaX || deltaY);

        for (var i = 0; i < steps; i++) {
            let step = StepFactory.createStep(leader.currentState.strideType, StepType.Full, leader.currentState.direction);
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

    // FileMember.prototype.populateQueue = function(follower, leader) {
    //     if (!leader)
    //         return;
            
    //     var self = this;
    //     var deltaX = follower.currentState.x - leader.currentState.x;
    //     var deltaY = follower.currentState.y - leader.currentState.y;
        
    //     var steps = Math.abs(deltaX || deltaY);
    //     console.log(steps);
    //     var nodes = Enumerable.Range(0, steps)
    //         .Select(function(i) {
    //             return {
    //                 direction: follower.currentState.direction,
    //                 stepType: 1,
    //                 stepCount: 1
    //             };
    //         }).ToArray();
            
    //     nodes.forEach(function(node){
    //         self.queue.push(node);
    //     });
    // }

    
}

export default FileMember;
