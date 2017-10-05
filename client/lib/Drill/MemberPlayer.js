/**
 * Manipulates count/position of a single member.
 */

var deltaX = { 0: 0, 90: 1, 180: 0, 270: -1 };
var deltaY = { 0: -1, 90: 0, 180: 1, 270: 0 };

class MemberPlayer {

    static stepForward(member) {
        member.currentState.count++;
        if (this.isBeyondEndOfDrill(member)) return;
        var scriptNode = member.script[member.currentState.count - 1];
        member.currentState.strideType = scriptNode.strideType;
        member.currentState.direction = scriptNode.direction;
        member.currentState.x += scriptNode.deltaX;
        member.currentState.y += scriptNode.deltaY;
    }

    static stepBackward(member) {
        if (this.isBeginningOfDrill(member)) return;
        if (this.isBeyondEndOfDrill(member)) {
            member.currentState.count--;
            return;
        }
        var scriptNode = member.script[member.currentState.count - 1];
    
        member.currentState.x -= scriptNode.deltaX;
        member.currentState.y -= scriptNode.deltaY;
        member.currentState.count--;
        member.currentState.direction = member.currentState.count == 0 ? member.initialState.direction : member.script[member.currentState.count - 1].direction;
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
        member.currentState.count = 0;
        member.currentState.direction = member.initialState.direction;
        member.currentState.x = member.initialState.x;
        member.currentState.y = member.initialState.y;            
    }
}

export default MemberPlayer;
