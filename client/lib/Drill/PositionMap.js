class PositionMap {
    constructor(members) {
        this.members = members;
        this.xMap = this.buidXMap();
        this.yMap = this.buildYMap();
        this.sortedXs = this.sortXs();
        this.sortedYs = this.sortYs();
//console.trace();
    }

    getMemberAtPosition(x, y) {
        if (!this.xMap[x] || !this.xMap[x][y])
            return null;

        return this.xMap[x][y];
    }

    getUpperLeft() {
        return {
            x: this.sortedXs[0],
            y: this.sortedYs[0]
        }
    }

    getBottomRight() {
        return {
            x: this.sortedXs[this.sortedXs.length - 1],
            y: this.sortedYs[this.sortedYs.length - 1]
        }
    }

    sortXs() {
        return this.members.map(m => {
            return m.currentState.x;
        }).sort();
    }

    sortYs() {
        return this.members.map(m => {
            return m.currentState.y;
        }).sort();
    }

    sortByPosition() {
        return this.members.sort((a, b) => {
            if (a.currentState.x < b.currentState.x || a.currentState.y < b.currentState.y)
                return -1;
            if (a.currentState.x > b.currentState.x || a.currentState.y > b.currentState.y)
                return 1;
            return 0;
        });
    }

    buidXMap() {
        var map = {};
        this.members.forEach(m => {
            let { x, y } = { x: m.currentState.x, y: m.currentState.y };

            if (!map[x])
                map[x] = {};

            map[x][y] = m;
        });
        return map;
    }

    buildYMap() {
        var map = {};
        this.members.forEach(m => {
            let { x, y } = { x: m.currentState.x, y: m.currentState.y };

            if (!map[y])
                map[y] = {};

            map[y][x] = m;
        });
        return map;        
    }
}

export default PositionMap;