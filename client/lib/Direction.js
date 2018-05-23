const directionNames = {
    '-1': 'CM',
    '-2': 'LCM',
    '-3': 'RCM',
    '0': 'N',
    '90': 'E',
    '180': 'S',
    '270': 'W',
    '45': 'NE',
    '135': 'SE',
    '225': 'SW',
    '315': 'NW',
};
class Direction {
    // a special case for countermarch
    static get CM() {
        return -1;
    }

    static get LCM() {
        return -2;
    }

    static get RCM() {
        return -3;
    }

    static get N() {
        return 0;
    }

    static get E() {
        return 90;
    }

    static get S() {
        return 180;
    }

    static get W() {
        return 270;
    }

    static get NE() {
        return 45;
    }

    static get SE() {
        return 135;
    }

    static get SW() {
        return 225;
    }

    static get NW() {
        return 315;
    }

    static getSlope(dir) {
        return slope[dir];
    }

    static getLineSlope(from, to) {
        return (from.y - to.y) / (from.x - to.x);
    }

    static getLineDirection(from, to) {
        let slope = this.getLineSlope(from, to);

        if (slope === -Infinity) {
            return Direction.N;
        }
        if (Object.is(slope, -0)) {
            return Direction.E;
        }
        if (slope === Infinity) {
            return Direction.S;
        }
        if (Object.is(slope, +0)) {
            return Direction.W;
        }
        if (slope === 1 && from.x <= to.x && from.y <= to.y) {
            return Direction.NE;
        }
        if (slope === 1 && from.x >= to.x && from.y >= to.y) {
            return Direction.SW;
        }
        if (slope === -1 && from.x >= to.x && from.y <= to.y) {
            return Direction.NW;
        }
        if (slope === -1 && from.x <= to.x && from.y >= to.y) {
            return Direction.SE;
        }
    }

    static isLineDirection(from, to, dir) {
        return this.getLineDirection(from, to) === dir;
    }

    // is p1 behind p2, with respect to dir
    // not necessarily following directly, but behind on
    // appropriate axis for the direction
    static isBehind(p1, p2, dir) {
        // get x/y delta
        const delta = {
            deltaX: p1.x - p2.x,
            deltaY: p1.y - p2.y,
        };
        console.log(delta);
        if (dir == Direction.N && delta.deltaY > 0) {
            return true;
        }
        if (dir == Direction.S && delta.deltaY < 0) {
            return true;
        }
        if (dir == Direction.E && delta.deltaX < 0) {
            return true;
        }
        if (dir == Direction.W && delta.deltaX > 0) {
            return true;
        }
        return false;
    }

    static leftOf(from) {
        let newDir = from - 90;
        return newDir < 0 ? 360 + newDir : newDir;
    }

    static rightOf(from) {
        let newDir = (from + 90);
        return newDir >= 360 ? newDir - 360 : newDir;
    }

    static aboutFaceFrom(fromDir) {
        return this.rotate180(fromDir);
    }

    static rotate180(fromDir) {
        let newDir = (fromDir + 180);
        return newDir >= 360 ? newDir - 360 : newDir;
    }

    static normalizeDirection(dir) {
        if (dir >= 0 && dir < 360) return dir;

        return dir - (Math.floor(dir / 360) * 360);
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
        return dir == Direction.NW ||
            dir == Direction.NE ||
            dir == Direction.SE ||
            dir == Direction.SW;
    }
}

const slope = {
    [Direction.N]: -Infinity,
    [Direction.E]: -0,
    [Direction.S]: Infinity,
    [Direction.W]: +0,
    [Direction.NE]: -1,
    [Direction.SW]: -1,
    [Direction.SE]: 1,
    [Direction.NW]: 1,
};


export default Direction;
