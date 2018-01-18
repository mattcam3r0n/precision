class PinwheelCalculator {
    constructor(pivotMember, members) {
        this.pivotMember = pivotMember;
        this.members = members;
    }

    /**
     * Get the radius of the pinwheel, which is distance
     * of the furthest member from pivot
     * @return {number}
     */
    getPinwheelRadius() {
        // the radius is the distance from the furthest member to the pivot point
        let radiuses = this.members
            .map((m) => this.calculateRadius(this.pivotMember, m));
        let max = radiuses.reduce((largest, r) => {
            return Math.max(largest, r);
        });
        return max;
    }

    /**
     * Calculate the radius (distance) between member and pivot point
     * @param {Member} pivotMember
     * @param {Member} member
     * @return {number}
     */
    calculateRadius(pivotMember, member) {
        let pivotPoint = pivotMember.currentState;
        let memberPoint = member.currentState;
        let distance = Math.sqrt(Math.pow(pivotPoint.x - memberPoint.x, 2)
            + Math.pow(pivotPoint.y - memberPoint.y, 2));
        return distance;
    }

    getPathArcInfo() {
        let distances = this.members
            .map((m) => {
                return {
                    point: {
                        x: m.currentState.x,
                        y: m.currentState.y,
                    },
                    distance: this.calculateRadius(this.pivotMember, m),
                };
            });

        let farthest = distances.reduce((a, b) => {
            if (b.distance > a.distance) {
                return b;
            } else {
                return a;
            }
        }, {distance: -1});
        return {
            distance: farthest.distance,
            point: farthest.point,
            angle: this.calculateAngle(this.pivotMember.currentState, farthest.point), // eslint-disable-line max-len
        };
    }

    calculatePointOnCircle(origin, radius, angle) {
        // formulae for calculating a point on circle
        // x = cx + r * cos(a)
        // y = cy + r * sin(a)
        return {
            x: origin.x + radius * Math.cos(angle),
            y: origin.y + radius * Math.sin(angle),
        };
    }

    calculateAngle(origin, point) {
        // formula for calculating the angle, given a point on circle
        return Math.atan2(point.y - origin.y, point.x - origin.x);
    }

    // TODO: should calculate each step (delta), not absolute position
    calculateSteps(rotationDirection, rotationAmount, counts) {
        let anglePerStep = rotationAmount / counts * Math.PI;
        let origin = this.pivotMember.currentState;
        let pinwheelSteps = {};
        this.members.forEach((m) => {
            pinwheelSteps[m.id] = this.calculateMemberSteps(m, rotationDirection, origin, anglePerStep, counts); // eslint-disable-line max-len
        });
        return pinwheelSteps;
    }

    calculateMemberSteps(member, rotationDirection, origin, anglePerStep, counts) { // eslint-disable-line max-len
        // TODO: account for rotationDirection. +/- from current angle
        let rotation = rotationDirection === 'counter-clockwise' ? -1 : 1;
        let radius = this.calculateRadius(this.pivotMember, member);
        let steps = [];
        for (let c = 1; c <= counts; c++) {
            let currentAngle = this.calculateAngle(origin, member.currentState);
            let p = this.calculatePointOnCircle(origin, radius, currentAngle + (anglePerStep * c * rotation)); // eslint-disable-line max-len
            steps.push(p);
        }
        return steps;
    }

    calculateMemberPosition(count) {}
}

export default PinwheelCalculator;
