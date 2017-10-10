import MemberPositionCalculator from './MemberPositionCalculator';

/**
 * Manipulates count/position of a single member.
 */
class MemberPlayer {

    static stepForward(member) {
        member.currentState = MemberPositionCalculator.stepForward(member);
    }

    static stepBackward(member) {
        member.currentState = MemberPositionCalculator.stepBackward(member);
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
