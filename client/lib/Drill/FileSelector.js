import FileMember from './FileMember';
import File from './File';
import StepDelta from '/client/lib/StepDelta';
import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';
import MemberPositionCalculator from '/client/lib/drill/MemberPositionCalculator';
import PositionMap from './PositionMap';

var followingDirs = {
    [Direction.N]: [Direction.N, Direction.E, Direction.W],
    [Direction.E]: [Direction.E, Direction.S, Direction.N],
    [Direction.S]: [Direction.S, Direction.E, Direction.W],
    [Direction.W]: [Direction.W, Direction.S, Direction.N]
};

var followedByDirs = {
    [Direction.N]: [Direction.S, Direction.E, Direction.W],
    [Direction.E]: [Direction.W, Direction.S, Direction.N],
    [Direction.S]: [Direction.N, Direction.E, Direction.W],
    [Direction.W]: [Direction.E, Direction.S, Direction.N]
};

class FileSelector {
    constructor(members, positionMap) {
        this.members = members;
        this.leaders = [];
        this.positionMap = positionMap || new PositionMap(members);
    }

    findFiles() {
        var fileMembers = {};

        // build FileMember for each member, and a map of them
        this.members.forEach(m => {
            var fm = new FileMember(m);
            fileMembers[m.id] = fm;
        });
console.log(fileMembers);
        // wire up folowers
        this.members.forEach(m => {
            let fm = fileMembers[m.id];
            let following = this.getFollowing(m);
//            let followedBy = this.getFollowedBy(m);
            fm.following = following ? fileMembers[following.id] : null;
//            fm.followedBy = followedBy ? fileMembers[followedBy.id] : null;
            if (fm.following)
                fm.following.followedBy = fm;

            // if leader, add to leader collection		
            if (!fm.following)
                this.leaders.push(fm);
        });

        // build files
        var files = [];
        this.leaders.forEach(l => {
            let file = new File(l);
            files.push(file);
        });

        return files;
    }

    getFollowing(m) {
        // TODO: do this by projecting member position, rather than fixed intervals?
        for (var i = 2; i <= 6; i += 2) {
            var pos = MemberPositionCalculator.stepForward(m, m.currentState, i);
            var following = this.positionMap.getMemberAtPosition(pos.x, pos.y);
            if (following)
                return following;
        }

        return null;
    }

    getFollowedBy(m) {
        var dirsToCheck = followedByDirs[m.currentState.direction];

        for (var i = 0; i < dirsToCheck.length; i++) {
            let dir = dirsToCheck[i];
            let pos = this.getRelativePosition(m.currentState, dir, 2);
            let followedBy = this.positionMap.getMemberAtPosition(pos.x, pos.y);

            // see if (potential) followedBy is following m
            if (followedBy && this.getFollowing(followedBy) == m) {
                return followedBy;
            }
        }

        return null;
    }

    /**
     * Get the position n (interval) steps in the given direction from position.
     * @param {*} position 
     * @param {*} strideType 
     * @param {*} dir 
     * @param {*} n 
     */
    getRelativePosition(position, dir, n) {
        var d = StepDelta.getDelta(position.strideType, StepType.Full, dir);
        return {
            x: position.x + (d.deltaX * n),
            y: position.y + (d.deltaY * n)
        };
    }

}

export default FileSelector;
