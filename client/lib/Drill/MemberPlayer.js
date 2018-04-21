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
        // TODO: when one (or all?) member is on edge of field?
        // return member.currentState.count >= member.script.length;
        return MemberPositionCalculator.isEndOfDrill(member);
    }

    static isBeyondEndOfDrill(member) {
        // return member.currentState.count > member.script.length;
        return MemberPositionCalculator.isBeyondEndOfDrill(member);
    }

    static goToBeginning(member) {
        member.currentState.count = 0;
        member.currentState.direction = member.initialState.direction;
        member.currentState.x = member.initialState.x;
        member.currentState.y = member.initialState.y;
        member.currentState.deltaX = member.initialState.deltaX;
        member.currentState.deltaY = member.initialState.deltaY;
    }
}

export default MemberPlayer;
