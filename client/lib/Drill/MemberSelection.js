import PositionMap from '/client/lib/drill/PositionMap';
import FileSelector from '/client/lib/drill/FileSelector';
import { StepPoint } from '/client/lib/Point';

class MemberSelection {
// distance formula
// sqrt( (x2−x1)^2 + (y2−y1)^2 )

    constructor(members) {
        this.members = members || [];
        this.positionMap = new PositionMap(members);
        this.fileSelector = new FileSelector(members, this.positionMap);
    }

    get length() {
        if (!this.members) return 0;
        return this.members.length;
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

    getUpperLeft() {
        return new StepPoint(this.members[0].currentState.strideType,
            this.positionMap.getUpperLeft());
    }

    getBottomLeft() {
        return new StepPoint(this.members[0].currentState.strideType,
            this.positionMap.getBottomLeft());
    }

    getUpperRight() {
        return new StepPoint(this.members[0].currentState.strideType,
            this.positionMap.getUpperRight());
    }

    getBottomRight() {
        return new StepPoint(this.members[0].currentState.strideType,
            this.positionMap.getBottomRight());
    }

    getClosestMember(point) {
        // get members on same x and y (or should i use file leaders?)
        // var closestMembers = positionMap.xMap[point.x] || positionMap.yMap[point.y];

        let closestMembers = this.members.map((m) => {
            let distance = Math.sqrt(Math.pow(m.currentState.x - point.x, 2)
                + Math.pow(m.currentState.y - point.y, 2));
            return {
                member: m,
                distance: distance,
            };
        }).sort((a, b) => {
            if (a.distance < b.distance) {
                return -1;
            }
            if (a.distance > b.distance) {
                return 1;
            }
            return 0;
        });

        let closest = closestMembers[0];

        return closest.member;
    }
}

export default MemberSelection;
