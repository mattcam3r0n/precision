import StepType from '/client/lib/StepType';
import Direction from '/client/lib/Direction';

class PinwheelCalculator {
    constructor(mode, pivotMember, members) {
        this.mode = mode;
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

    getPathArcInfo(rotationDirection, rotationAngle) {
        let origin = this.pivotMember.currentState;
        let farthest = this.getFarthestMemberFromPivot();
        let angleOfFarthestPoint = this.calculateAngle(origin, farthest.point); // eslint-disable-line max-len
        let radius = farthest.distance;

        let arcStartAngle;
        let arcEndAngle;
        let arcEndPoint;
        let arrowAngle;
        if (rotationDirection === 'counter-clockwise') {
            arcStartAngle = angleOfFarthestPoint - (rotationAngle * Math.PI);
            arcEndAngle = angleOfFarthestPoint;
            arcEndPoint = this.calculatePointOnCircle(origin,
                radius,
                arcStartAngle);
            arrowAngle = (arcStartAngle * 180 / Math.PI);
        } else {
            arcStartAngle = angleOfFarthestPoint;
            arcEndAngle = angleOfFarthestPoint + (rotationAngle * Math.PI);
            arcEndPoint = this.calculatePointOnCircle(origin,
                radius,
                arcEndAngle);
            arrowAngle = (arcEndAngle * 180 / Math.PI) + 180;
        }


        return {
            origin: origin,
            radius: radius,
            farthestPoint: farthest.point,
            angleOfFarthestPoint: angleOfFarthestPoint,
            startAngle: arcStartAngle,
            endAngle: arcEndAngle,
            arcEndPoint: arcEndPoint,
            arrowAngle: arrowAngle,
        };
    }

    getFarthestMemberFromPivot() {
        let distances = this.getMemberDistancesFromPivot();
        let farthest = distances.reduce((a, b) => {
            if (b.distance > a.distance) {
                return b;
            } else {
                return a;
            }
        }, { distance: -1 });
        return farthest;
    }

    getMemberDistancesFromPivot() {
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
        return distances;
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
    calculateSteps(origin,
                    rotationDirection,
                    rotationAngle,
                    counts) {
        const pinwheelSteps = {};
        const rotationFactor = rotationDirection === 'counter-clockwise' ? -1 : 1;
        const anglePerStep = rotationAngle / counts * Math.PI;
        this.members.forEach((member) => {
            pinwheelSteps[member.id] = this.calculateMemberSteps(member,
                origin,
                rotationFactor,
                rotationAngle,
                anglePerStep,
                counts);
        });
        return pinwheelSteps;
    }

    calculateMemberSteps(member,
                        origin,
                        rotationFactor,
                        rotationAngle,
                        anglePerStep,
                        counts) {
        const pivotAngle = member === this.pivotMember
            ? this.degreesInRadians(member.currentState.direction + 180)
            : this.calculateAngle(origin, member.currentState);
        const startDirection = this.calculateStartDirection(member,
                                                            pivotAngle,
                                                            rotationFactor);
        let radius = this.calculateRadius(this.pivotMember, member);
        let steps = [];
        let lastStep = member.currentState;
        for (let count = 1; count <= counts; count++) {
            let pos = this.calculateMemberPosition(member,
                                                    count,
                                                    origin,
                                                    radius,
                                                    startDirection,
                                                    rotationFactor,
                                                    anglePerStep);
            let direction;
            if (count === counts) {
                // set last count to nearest 90 degrees
                direction = Math.floor(pos.direction / 90) * 90;
            } else {
                direction = pos.direction;
            }

            let step = {
                strideType: member.currentState.strideType,
                stepType: StepType.Pinwheel,
                x: pos.x,
                y: pos.y,
                deltaX: pos.x - lastStep.x,
                deltaY: pos.y - lastStep.y,
                direction: Direction.normalizeDirection(direction),
            };
            steps.push(step);
            lastStep = step;
        }
        // add one more step to tell them to continue it last state (normal steps)
        steps.push({
            strideType: member.currentState.strideType,
            stepType: StepType.Full,
            direction: Direction.normalizeDirection(lastStep.direction),
        });

        return steps;
    }

    calculateMemberPosition(member,
                            count,
                            origin,
                            radius,
                            startDirection,
                            rotationFactor,
                            anglePerStep) {
            // remove?
        let pivotAngle = member === this.pivotMember
            ? this.degreesInRadians(member.currentState.direction + 180)
            : this.calculateAngle(origin, member.currentState);
        let newPivotAngle = pivotAngle
            + (anglePerStep * count * rotationFactor);
        let p = this.calculatePointOnCircle(origin, radius, newPivotAngle);
        // let startDirectionRadians = this.degreesInRadians(startDirection);
        // let newDirection = startDirectionRadians
        //                     + (anglePerStep * count * rotationFactor);
        // let direction = this.radiansInDegrees(newDirection);
//        let direction = this.radiansInDegrees(newPivotAngle + this.degreesInRadians(90));
        let direction = rotationFactor > 0
            ? this.radiansInDegrees(newPivotAngle)
            : this.radiansInDegrees(newPivotAngle) + 180;
        return {
            count: count,
            x: p.x,
            y: p.y,
            direction: Direction.normalizeDirection(direction),
        };
    }

    calculateStartDirection(member, pivotAngle, rotationDirection) {
        if (member === this.pivotMember && this.mode == 'pinwheel') {
            return member.currentState.direction + 180;
        }
        if (member === this.pivotMember && this.mode == 'gate') {
            return member.currentState.direction + (180 * rotationDirection);
        }
        const pivotAngleInDegrees = this.radiansInDegrees(pivotAngle);
        const quadrant = Math.floor(pivotAngleInDegrees / 90);
        const startDirection = (quadrant * 90)
                                + (rotationDirection > 0 ? 180 : 0);
        return startDirection;
    }

    calculateGatePivotDirection(member, pivotAngle, rotationDirection) {
        if (rotationDirection > 0
            && member.currentState.direction == Direction.N) {
            return Direction.S;
        }
        if (rotationDirection > 0
            && member.currentState.direction == Direction.E) {
            return Direction.W;
        }
    }

    normalizeDirection(dir) {
        dir = Number(dir.toFixed(2));
        if (dir >= 0 && dir < 360) return dir;

        return dir - (Math.floor(dir / 360) * 360);
    }

    degreesInRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    radiansInDegrees(radians) {
        return ((radians * 180 / Math.PI) + 180);
    }
}

export default PinwheelCalculator;
