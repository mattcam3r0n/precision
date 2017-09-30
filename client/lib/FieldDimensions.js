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
* | 8 | 16 |8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8|8| 16 | 8 | 90
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

var fieldWidth = 1560,
    fieldHeight = 780;

var widthInSteps = {
    [StrideType.SixToFive]: 156,
    [StrideType.EightToFive]: 208
};

var heightInSteps = {
    [StrideType.SixToFive]: 78,
    [StrideType.EightToFive]: 90
};

var oneStepY_6to5 = fieldHeight / heightInSteps[StrideType.SixToFive],
    oneStepX_6to5 = fieldWidth / widthInSteps[StrideType.SixToFive];

var oneStepY_8to5 = fieldHeight / heightInSteps[StrideType.EightToFive],
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
        return 16;
    }

    static get marcherHeight() {
        return 16;
    }

    static snapPoint(strideType, point) {
        if (strideType == StrideType.EightToFive)
            return {
                x: Math.floor(point.x / oneStepX_8to5) * oneStepX_8to5,
                y: Math.floor(point.y / oneStepY_8to5) * oneStepY_8to5
            };

        return {
            x: Math.floor(point.x / oneStepX_6to5) * oneStepX_6to5,
            y: Math.floor(point.y / oneStepY_6to5) * oneStepY_6to5
        };
    }

}



export default FieldDimensions;