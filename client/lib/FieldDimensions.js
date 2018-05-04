import StrideType from './StrideType';

/*
*
* 6/5 and 8/5 steps across field
*
*                       156 / 208
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

/* eslint camelcase: 0 */

const fieldWidth = 1560; // / 2; // 624 * 2, //1560,
const fieldHeight = 760; // / 2; // 312 * 2 //780;

let widthInSteps = {
  [StrideType.SixToFive]: 156,
  [StrideType.EightToFive]: 208,
};

let heightInSteps = {
  [StrideType.SixToFive]: 76, // 6 + 24 + 16 + 24 + 6
  [StrideType.EightToFive]: 100, // 8 + 32 + 20 + 32 + 8
};

const oneStepY_6to5 = fieldHeight / heightInSteps[StrideType.SixToFive];
const oneStepX_6to5 = fieldWidth / widthInSteps[StrideType.SixToFive];

const oneStepY_8to5 = oneStepY_6to5 * 30 / 40; // fieldHeight / heightInSteps[StrideType.EightToFive]; // oneStepY_6to5 * (24/32), //fieldHeight / heightInSteps[StrideType.EightToFive],
const oneStepX_8to5 = fieldWidth / widthInSteps[StrideType.EightToFive];
const oneStepY_8to5_Adj = oneStepY_6to5 * 16 / 20;

const fiveYardsX = oneStepX_6to5 * 6;
const fiveYardsY = oneStepY_6to5 * 6;

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
      height: fieldHeight - fiveYardsY * 2,
      width: fieldWidth - fiveYardsX * 2,
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

  static get oneStepY_8to5_Adj() {
    return oneStepY_8to5_Adj;
  }

  static get oneStepX_8to5() {
    return oneStepX_8to5;
  }

  static get sixToFiveObliqueDeltaX() {
    return 6 / 8 * oneStepX_6to5;
  }

  static get sixToFiveObliqueDeltaY() {
    return 6 / 8 * oneStepY_6to5;
  }

  static get eightToFiveObliqueDeltaX() {
    return 8 / 12 * oneStepX_8to5;
  }

  static get eightToFiveObliqueDeltaY() {
    return 8 / 12 * oneStepY_8to5;
  }

  static get yOffset_8to5() {
    // return 8 * (this.oneStepY_8to5 - this.oneStepX_8to5);
    return 0;
  }

  static get fiftyYardlineX() {
    return this.goallineX + 10 * this.fiveYardsX;
  }

  static yardlineX(yardLine, relativeTo50) {}

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

  static get farHashY() {
    return oneStepY_6to5 * 24 + this.farSidelineY;
  }

  static get nearHashY() {
    return this.nearSidelineY - oneStepY_6to5 * 24;
  }

  static get marcherWidth() {
    return 12;
  }

  static get marcherHeight() {
    return 12;
  }

  static snapPoint(strideType, point) {
    let stepSize = this.getStepSize(strideType || StrideType.SixToFive);
    return {
      x: Math.round(point.x / stepSize.x) * stepSize.x,
      y: Math.round(point.y / stepSize.y) * stepSize.y - stepSize.yOffset,
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
        yOffset: this.yOffset_8to5,
      };
    }

    return {
      x: this.oneStepX_6to5,
      y: this.oneStepY_6to5,
      yOffset: 0,
    };
  }

  static snapX(strideType, x) {
    let stepSize = this.getStepSize(strideType || StrideType.SixToFive);
    return +(Math.round(x / stepSize.x) * stepSize.x).toFixed(3);
  }

  static snapY(strideType, y) {
    let stepSize = this.getStepSize(strideType || StrideType.SixToFive);
    return +(
      Math.round(y / stepSize.y) * stepSize.y -
      stepSize.yOffset
    ).toFixed(3);
  }

  static snapObliqueX(strideType, x) {
    let deltaX =
      strideType == StrideType.EightToFive
        ? this.eightToFiveObliqueDeltaX
        : this.sixToFiveObliqueDeltaX;
    return +(Math.round(x / deltaX) * deltaX).toFixed(3);
  }

  static snapObliqueY(strideType, y) {
    let deltaY =
      strideType == StrideType.EightToFive
        ? this.eightToFiveObliqueDeltaY
        : this.sixToFiveObliqueDeltaY;
    return +(Math.round(x / deltaY) * deltaY).toFixed(3);
  }

  // TODO: support 8/5
  // convert field coordinates to step coordinates
  static toStepPoint(fieldPoint, strideType) {
    // from field point
    return {
      x: this.snapX(strideType, fieldPoint.x),
      y: this.snapY(strideType, fieldPoint.y),
    };
    // return fieldPoint;
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
