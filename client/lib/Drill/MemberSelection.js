import PositionMap from '/client/lib/drill/PositionMap';
import FileSelector from '/client/lib/drill/FileSelector';

class MemberSelection {

// distance formula
// sqrt( (x2−x1)^2 + (y2−y1)^2 )

    constructor(members) {
        this.members = members || [];
        this.positionMap = new PositionMap(members);
        this.fileSelector = new FileSelector(members);
    }

    getFiles() {
        return this.fileSelector.findFiles();
    }

    getRanks() {
        // TODO
    }

    getRightGuide() {
        // right, front?
    }

    getClosestMember(point) {
        // get members on same x and y (or should i use file leaders?)
        //var closestMembers = positionMap.xMap[point.x] || positionMap.yMap[point.y];

        var closestMembers = this.members.map(m => {
            let distance = Math.sqrt(Math.pow(m.currentState.x - point.x, 2) + Math.pow(m.currentState.y - point.y, 2));
            return {
                member: m,
                distance: distance
            }
        }).sort((a, b) => {
            if (a.distance < b.distance)
                return -1;
            if (a.distance > b.distance)
                return 1;
            return 0;
        });

        var closest = closestMembers[0];

        return closest.member;

        // calc distance, take smallest
    }
}

export default MemberSelection;
