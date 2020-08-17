/**
 * A map of turns by position (x,y).
 *
 * {
 *   x: int,
 *   y: int,
 *   count: int,
 *   marcher: object,
 *   state: object,
 * }
 */
class TurnPositionMap {
    constructor() {
        this.turnMap = {}; // keyed by (x,y), holds array of turns
    }

    add(turn) {
        const key = positionKey(turn.x, turn.y);
        if (!this.turnMap[key]) {
            this.turnMap[key] = [];
        }
        this.turnMap[key].push(turn);
    }

    get(x, y) {
        // return array of turns at given point
        const key = positionKey(x, y);
        return this.turnMap[key];
    }

    count() {
        // return number of unique turn positions
        return object.keys(this.turnMap).length;
    }
}

function positionKey(x, y) {
    return x + ',' + y;
}

export default TurnPositionMap;
