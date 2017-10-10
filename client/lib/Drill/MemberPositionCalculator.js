/**
 * Calculates count/position of a single member, relative to current position,
 * BUT DOES NOT CHANGE STATE
 */

var deltaX = { 0: 0, 90: 1, 180: 0, 270: -1 };
var deltaY = { 0: -1, 90: 0, 180: 1, 270: 0 };

class MemberPositionCalculator {

    static stepForward(member) {
        var position = Object.assign({}, member.currentState);

        position.count = member.currentState.count++;
        if (this.isBeyondEndOfDrill(member)) return;
        var scriptNode = member.script[member.currentState.count - 1];
        position.strideType = scriptNode.strideType;
        position.direction = scriptNode.direction;
        position.x += scriptNode.deltaX;
        position.y += scriptNode.deltaY;
        return position;
    }

    static stepBackward(member) {
        var position = Object.assign({}, member.currentState);

        if (this.isBeginningOfDrill(member)) return;
        if (this.isBeyondEndOfDrill(member)) {
            position.count--;
            return;
        }
        var scriptNode = member.script[position.count - 1];
    
        position.x -= scriptNode.deltaX;
        position.y -= scriptNode.deltaY;
        position.count--;
        position.direction = position.count == 0 ? member.initialState.direction : member.script[position.count - 1].direction;
        return position;
    }

    static isBeginningOfDrill(member) {
        return member.currentState.count === 0;
    }

    static isEndOfDrill(member) {
        return member.currentState.count >= member.script.length;
    }

    static isBeyondEndOfDrill(member) {
        return member.currentState.count > member.script.length;        
    }

    static goToBeginning(member) {
        var position = Object.assign({}, member.currentState);

        position.count = 0;
        position.direction = member.initialState.direction;
        position.x = member.initialState.x;
        position.y = member.initialState.y;
        
        return position;
    }
}

export default MemberPositionCalculator;
