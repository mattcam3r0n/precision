/**
 * Manipulates count/position of a single member.
 */

var deltaX = { 0: 0, 90: 1, 180: 0, 270: -1 };
var deltaY = { 0: -1, 90: 0, 180: 1, 270: 0 };

class MemberPlayer {

     static stepForward(member) {

     }

     static stepBackward(member) {

     }

     static isBeginningOfDrill(member) {

     }

     static isEndOfDrill(member) {

     }

     static isBeyondEndOfDrill(member) {

     }

     getDeltaX(direction, stepType) {
        return deltaX[direction] * stepType;
    };
    
    getDeltaY(direction, stepType) {
        return deltaY[direction] * stepType;
    };
         
}

 export default MemberPlayer;
