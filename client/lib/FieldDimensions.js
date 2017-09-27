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

var fiveYardsX = fieldWidth / widthInSteps[StrideType.SixToFive] * 6,
fiveYardsY = fieldHeight / heightInSteps[StrideType.SixToFive] * 6;

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
        return fieldHeight - (fiveYardsY * 2);
    }
}



export default FieldDimensions;