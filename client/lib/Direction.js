var directionNames = {
    "-1": "CM",
    "0": "N",
    "90": "E",
    "180": "S",
    "270": "W",
    "45": "NE",
    "135": "SE",
    "225": "SW",
    "315": "NW"
};
class Direction {
    // a special case for countermarch
    static get CM(){
        return -1;
    }

    static get N(){
        return 0;
    }

    static get E(){
        return 90;
    }

    static get S(){
        return 180;
    }

    static get W(){
        return 270;
    }

    static get NE(){
        return 45;
    }

    static get SE(){
        return 135;
    }

    static get SW(){
        return 225;
    }

    static get NW(){
        return 315;
    }

    static getSlope(dir) {
        return slope[dir];
    }

    static getLineSlope(from, to) {
        return (from.y - to.y) / (from.x - to.x);
    }

    static getLineDirection(from, to) {
        var slope = this.getLineSlope(from, to);

        if (slope === -Infinity)
            return Direction.N;
        if (Object.is(slope, -0))
            return Direction.E;
        if (slope === Infinity)
            return Direction.S;
        if (Object.is(slope, +0))
            return Direction.W;
        if (slope === 1 && from.x <= to.x && from.y <= to.y)
            return Direction.NE;
        if (slope === 1 && from.x >= to.x && from.y >= to.y)
            return Direction.SW;
        if (slope === -1 && from.x >= to.x && from.y <= to.y)
            return Direction.NW;
        if (slope === -1 && from.x <= to.x && from.y >= to.y)
            return Direction.SE;
    }

    static isLineDirection(from, to, dir) {
        return this.getLineDirection(from, to) === dir;
    }

    static leftTurnDirection(from) {
        var newDir = from - 90;
        return newDir < 0 ? 360 + newDir : newDir;
    }

    static rightTurnDirection(from) {
        var newDir = (from + 90);
        return newDir >= 360 ? newDir - 360 : newDir;
    }

    static getDirection(dir) {
        return this[dir] == undefined ? dir : this[dir];
    }

    static getDirectionName(dir) {
        dir = this.getDirection(dir);
        return directionNames[dir];
    }

    static isOblique(dir) {
        dir = this.getDirection(dir);
        return dir == Direction.NW || dir == Direction.NE || dir == Direction.SE || dir == Direction.SW;
    }
    
}

var slope = {
    [Direction.N]: -Infinity,
    [Direction.E]: -0,
    [Direction.S]: Infinity,
    [Direction.W]: +0,
    [Direction.NE]: -1,
    [Direction.SW]: -1,
    [Direction.SE]: 1,
    [Direction.NW]: 1
};


export default Direction;