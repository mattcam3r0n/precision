import FileMember from './FileMember';

class FileSelector {
    constructor(members) {
        this.members = members;
        this.positionMap = this.buildPositionMap(members);
    }

    findFiles() {
        // loop thru band
        this.members.forEach(m => {
            var fm = new FileMember(m);
            // look for leader, and look for follower, assign to current state
            fm.following = this.getFollowing(m);
            fm.followedBy = this.getFollowedBy(m);
            // if leader, add to leader collection		
            if (!m.currentState.following)
                this.leaders.push(m);
        });

    }

    buildPositionMap() {
        var map = {};
        this.members.forEach(m => {
            let { x, y } = { x: m.currentState.x, y: m.currentState.y };

            if (!map[x])
                map[x] = {};

            map[x][y] = m;
        });
        return map;
    }

    getFollowing(m) {

    }

    getFollower(m) {

    }
}
/* 

    E E E E
    E E E E
    E E E E
    E E E E

     E
      S 
       E
*/

export default FileSelector;
