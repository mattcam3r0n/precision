/**
 * Calculates count/position of a single member, relative to current position,
 * BUT DOES NOT CHANGE STATE
 */

var deltaX = { 0: 0, 90: 1, 180: 0, 270: -1 };
var deltaY = { 0: -1, 90: 0, 180: 1, 270: 0 };

class MemberPositionCalculator {

    static stepForward(member, position) {
        var position = position || Object.assign({}, member.currentState);

        position.count++; 

        if (this.isBeyondEndOfDrill(member, position)) 
            return position;

        var scriptNode = member.script[position.count - 1];
        position.strideType = scriptNode.strideType;
        position.direction = scriptNode.direction;
        position.x += scriptNode.deltaX;
        position.y += scriptNode.deltaY;

        return position;
    }

    static stepBackward(member, position) {
        var position = position || Object.assign({}, member.currentState);

        if (this.isBeginningOfDrill(member, position)) 
            return position;

        if (this.isBeyondEndOfDrill(member, position)) {
            position.count--;
            return position;
        }
        var scriptNode = member.script[position.count - 1];
    
        position.x -= scriptNode.deltaX;
        position.y -= scriptNode.deltaY;
        position.count--;
        position.direction = position.count == 0 ? member.initialState.direction : member.script[position.count - 1].direction;
        return position;
    }

    static isBeginningOfDrill(member, position) {
        return position.count === 0;
    }

    static isEndOfDrill(member, position) {
        return position.count >= member.script.length;
    }

    static isBeyondEndOfDrill(member, position) {
        return position.count > member.script.length;        
    }

    static goToBeginning(member) {
        var position = Object.assign({}, member.currentState);

        position.count = 0;
        position.direction = member.initialState.direction;
        position.x = member.initialState.x;
        position.y = member.initialState.y;
        
        return position;
    }

    static goToCount(member, goToCount, position) {
        var position = position || Object.assign({}, member.currentState);

        if (goToCount < member.currentState.count) {
            while (goToCount < position.count) {
                position = this.stepBackward(member, position);
            }
        } else {
            while (goToCount > position.count) {
                position = this.stepForward(member, position);
            }
        }

        return position;

    }
}

export default MemberPositionCalculator;
