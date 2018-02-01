class PositionMap {
    constructor(members) {
        this.members = members;
        this.xMap = this.buidXMap();
        this.yMap = this.buildYMap();
        this.sortedXs = this.sortXs();
        this.sortedYs = this.sortYs();
    }

    getMemberAtPosition(x, y) {
        if (!this.xMap[x] || !this.xMap[x][y]) {
            return null;
        }

        return this.xMap[x][y];
    }

    getUpperLeft() {
        return {
            x: this.sortedXs[0],
            y: this.sortedYs[0],
        };
    }

    getBottomLeft() {
        return {
            x: this.sortedXs[0],
            y: this.sortedYs[this.sortedYs.length - 1],
        };
    }

    getUpperRight() {
        return {
            x: this.sortedXs[this.sortedXs.length - 1],
            y: this.sortedYs[0],
        };
    }

    getBottomRight() {
        return {
            x: this.sortedXs[this.sortedXs.length - 1],
            y: this.sortedYs[this.sortedYs.length - 1],
        };
    }

    sortXs() {
        return this.members.map((m) => {
            return m.currentState.x;
        }).sort((a, b) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
    }

    sortYs() {
        return this.members.map((m) => {
            return m.currentState.y;
        }).sort((a, b) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
    }

    sortByPosition() {
        return this.members.sort((a, b) => {
            if (a.currentState.x < b.currentState.x
                || a.currentState.y < b.currentState.y) {
                return -1;
            }
            if (a.currentState.x > b.currentState.x
                || a.currentState.y > b.currentState.y) {
                return 1;
            }
            return 0;
        });
    }

    buidXMap() {
        let map = {};
        this.members.forEach((m) => {
            let { x, y } = { x: m.currentState.x, y: m.currentState.y };

            if (!map[x]) {
                map[x] = {};
            }

            map[x][y] = m;
        });
        return map;
    }

    buildYMap() {
        let map = {};
        this.members.forEach((m) => {
            let { x, y } = { x: m.currentState.x, y: m.currentState.y };

            if (!map[y]) {
                map[y] = {};
            }

            map[y][x] = m;
        });
        return map;
    }
}

export default PositionMap;
