import StrideType from './StrideType';

/*
*
* 6/5 and 8/5 steps across field
*
*						  156 / 208
* -----------------------------------------------------------
* |                       6 / 8                             |
* |   ---------------------------------------------------   |
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* | 6 | 12 |6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6|6| 12 | 6 | 78
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* | 8 | 16 |8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8| 16 | 8 | 100
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* |   |    | | | | | | | | | | | | | | | | | | | | |    |   |
* |   ---------------------------------------------------   |
* |                       6 / 8                             |   
* -----------------------------------------------------------
*
* 26 five yard segments
* 24 five yard segments inside sidelines
* 20 five yard segments between goal lines
*/

var fieldWidth = 1560, //624 * 2, //1560,
    fieldHeight = 780 //312 * 2 //780;

var widthInSteps = {
    [StrideType.SixToFive]: 156,
    [StrideType.EightToFive]: 208
};

var heightInSteps = {
    [StrideType.SixToFive]: 78,
    [StrideType.EightToFive]: 100
};

var oneStepY_6to5 = fieldHeight / heightInSteps[StrideType.SixToFive],
    oneStepX_6to5 = fieldWidth / widthInSteps[StrideType.SixToFive];

var oneStepY_8to5 = oneStepY_6to5 * (22/28), //fieldHeight / heightInSteps[StrideType.EightToFive],
    oneStepX_8to5 = fieldWidth / widthInSteps[StrideType.EightToFive];

var fiveYardsX = oneStepX_6to5 * 6,
    fiveYardsY = oneStepY_6to5 * 6;

class FieldDimensions {
    static get width() {
        return fieldWidth;
    }

    static get height() {
        return fieldHeight;
    }

    static widthInSteps(strideType) {
        return widthInSteps[strideType];
    }

    static heightInSteps(strideType) {
        return heightInSteps[strideType];
    }

    static get sidelineRect() {
        return {
            top: fiveYardsY,
            left: fiveYardsX,
            height: fieldHeight - (fiveYardsY * 2),
            width: fieldWidth - (fiveYardsX * 2)
        };
    }

    static get goallineX() {
        return fiveYardsX * 3;
    }

    static get oneStepY_6to5() {
        return oneStepY_6to5;
    } 
    static get oneStepX_6to5() {
        return oneStepX_6to5;
    }

    static get oneStepY_8to5() {
        return oneStepY_8to5;
    }

    static get oneStepX_8to5() {
        return oneStepX_8to5;
    }

    static get yOffset_8to5() {
        return 8 * (this.oneStepY_8to5 - this.oneStepX_8to5);
    }

    static get fiftyYardlineX() {
        return this.goallineX + (10 * this.fiveYardsX);
    }

    static yardlineX(yardLine, relativeTo50) {

    }

    static get fiveYardsX() {
        return fiveYardsX;
    }

    static get fiveYardsY() {
        return fiveYardsY;
    }

    static get farSidelineY() {
        return fiveYardsY;
    }

    static get nearSidelineY() {
        return fieldHeight - fiveYardsY;
    }

    static get farHashY(){
        return (oneStepY_6to5 * 22) + this.farSidelineY;
    }

    static get nearHashY() {
        return this.nearSidelineY - (oneStepY_6to5 * 22);
    }

    static get marcherWidth() {
        return 12;
    }

    static get marcherHeight() {
        return 12;
    }

    static snapPoint(strideType, point) {
        var stepSize = this.getStepSize(strideType || StrideType.SixToFive);
		return {
			x: Math.round(point.x / stepSize.x) * stepSize.x,
			y: (Math.round(point.y / stepSize.y) * stepSize.y) - stepSize.yOffset
        };

        // if (strideType == StrideType.EightToFive)
        //     return {
        //         x: Math.floor(point.x / oneStepX_8to5) * oneStepX_8to5,
        //         y: Math.floor(point.y / oneStepY_8to5) * oneStepY_8to5
        //     };

        // return {
        //     x: Math.floor(point.x / oneStepX_6to5) * oneStepX_6to5,
        //     y: Math.floor(point.y / oneStepY_6to5) * oneStepY_6to5
        // };
    }

    static getStepSize(strideType) {
        if (strideType == StrideType.EightToFive) {
            return {
                x: this.oneStepX_8to5,
                y: this.oneStepY_8to5,
                yOffset: this.yOffset_8to5
            };
        }

        return {
            x: this.oneStepX_6to5,
            y: this.oneStepY_6to5,
            yOffset: 0
        };
    }

    static snapX(strideType, x) {
        var stepSize = this.getStepSize(strideType || StrideType.SixToFive);
        return +((Math.round(x / stepSize.x) * stepSize.x).toFixed(3));
    }

    static snapY(strideType, y) {
        var stepSize = this.getStepSize(strideType || StrideType.SixToFive);
        return +(((Math.round(y / stepSize.y) * stepSize.y) - stepSize.yOffset).toFixed(3));
    }

    // TODO: support 8/5
    // convert field coordinates to step coordinates
    static toStepPoint(fieldPoint, strideType) { // from field point
		return {
			x: this.snapX(strideType, fieldPoint.x),
			y: this.snapY(strideType, fieldPoint.y)
        };
        //return fieldPoint;
	}

    // convert stepPoint to field point
    static toFieldPoint(stepPoint, strideType) {
        // var stepSize = this.getStepSize(strideType || StrideType.SixToFive);
        // return {
        //     x: stepPoint.x * stepSize.x,
        //     y: stepPoint.y * stepSize.y
        // };
        return stepPoint;
    }

}



export default FieldDimensions;