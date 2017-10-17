class PositionMap {
    constructor(members) {
        this.members = members;
        this.xMap = this.buildPositionMap();
        this.yMap = this.buildYMap();
    }

    getMemberAtPosition(x, y) {
        if (!this.xMap[x] || !this.xMap[x][y])
            return null;

        return this.xMap[x][y];
    }

    buildPositionMap() {
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