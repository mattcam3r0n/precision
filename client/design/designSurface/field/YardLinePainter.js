import FieldDimensions from '/client/lib/FieldDimensions';

class YardLinePainter {
  static paint(canvas, options = {}) {
    addSideLines(canvas, options);
    addYardLines(canvas, options);
    addYardLineNumbers(canvas, options);
    addHashMarks(canvas, options);
  }
}

let _opacity = 0.8;
let _yardlineMarkers = [
  '', // no longer showing G line, but leaving for calcs
  '10',
  '20',
  '30',
  '40',
  '50',
  '40',
  '30',
  '20',
  '10',
  '',
];

function addSideLines(canvas, options) {
  let sidelineRect = FieldDimensions.sidelineRect;
  let rect = new fabric.Rect({
    left: sidelineRect.left,
    top: sidelineRect.top,
    width: sidelineRect.width,
    height: sidelineRect.height,
    fill: options.fill || 'rgba(0,0,0,0)',
    selectable: false,
    stroke: options.stroke || 'white',
    strokeWidth: options.strokeWidth || 3,
    evented: false,
    opacity: options.opacity || _opacity,
  });
  canvas.add(rect);
  rect.sendToBack();
}

function addYardLines(canvas, options) {
  for (let i = 0; i < 21; i++) {
    let x = FieldDimensions.goallineX + i * FieldDimensions.fiveYardsX;
    let coords = [
      x,
      FieldDimensions.farSidelineY,
      x,
      FieldDimensions.farSidelineY +
        FieldDimensions.height -
        2 * FieldDimensions.fiveYardsY,
    ];
    let line = new fabric.Line(coords, {
      fill: options.fill || 'white',
      stroke: options.stroke || 'white',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      opacity: options.opacity || _opacity,
    });
    canvas.add(line);
    line.sendToBack();
  }
}

function addHashMarks(canvas, options) {
  let lineOptions = {
    fill: options.fill || 'white',
    stroke: options.stroke || 'white',
    strokeWidth: options.strokeWidth || 2,
    selectable: false,
    evented: false,
    opacity: options.strokeWidth || _opacity,
  };
  for (let i = 0; i < 21; i++) {
    let x = FieldDimensions.goallineX + i * FieldDimensions.fiveYardsX;
    let farHashCoords = [
      x - 10,
      FieldDimensions.farHashY,
      x + 10,
      FieldDimensions.farHashY,
    ];
    let nearHashCoords = [
      x - 10,
      FieldDimensions.nearHashY,
      x + 10,
      FieldDimensions.nearHashY,
    ];
    let farHash = new fabric.Line(farHashCoords, lineOptions);
    let nearHash = new fabric.Line(nearHashCoords, lineOptions);
    canvas.add(farHash);
    canvas.add(nearHash);
    farHash.sendToBack();
    nearHash.sendToBack();
  }
}

function addYardLineNumbers(canvas, options) {
  let textOptions = {
    fontSize: options.fontSize || 32,
    lineHeight: 1,
    originX: 'center',
    originY: 'center',
    scaleX: .8,
    fontFamily: 'Palatino',
    fontWeight: 'normal',
    stroke: options.stroke || 'white',
    fill: options.fill || 'white',
    opacity: options.opacity || _opacity,
    statefullCache: true,
    selectable: false,
    evented: false,
  };

  // add near
  _yardlineMarkers.forEach((m, i) => {
    addYardlineNumber(canvas, m, i, true, textOptions);
  });

  // add far
  _yardlineMarkers.forEach((m, i) => {
    addYardlineNumber(canvas, m, i, false, textOptions);
  });
}

/*
  - top of number is 27' from sideline (10.8 steps)
  - numbers are 6' high by 4' wide (2.4 x 1.6)
  - bottom of number is (8.4 steps)
*/
function addYardlineNumber(canvas, number, index, isNear, options) {
  // add each digit
  const firstDigit = number.substring(0, 1);
  const secondDigit = number.substring(1, 2);
  const leftOf50 = index < _yardlineMarkers.length / 2;

  const y = isNear
    ? FieldDimensions.nearSidelineY - FieldDimensions.oneStepY_6to5 * 9.5
    : FieldDimensions.farSidelineY + FieldDimensions.oneStepY_6to5 * 9.5;
  const firstX =
    FieldDimensions.goallineX + index * FieldDimensions.fiveYardsX * 2 - 10;
  const secondX =
    FieldDimensions.goallineX + index * FieldDimensions.fiveYardsX * 2 + 12;
  // add first digit
  addDigit(canvas, firstDigit, { left: firstX, top: y }, options);
  // add second digit
  if (secondDigit) {
    addDigit(canvas, secondDigit, { left: secondX, top: y }, options);
  }
  if (number && number != '50') { // if not Goal line, which is empty number
    // add arrow
    addNumberArrow(canvas, {
      left: leftOf50 ? firstX - 15 : secondX + 15,
      top: y,
    }, leftOf50);
  }
}

function addDigit(canvas, digit, position, options) {
  let text = new fabric.Text(digit, Object.assign(position, options));
  canvas.add(text);
  text.sendToBack();
}

function addNumberArrow(canvas, position, leftOf50) {
  const arrow = new fabric.Triangle({
    left: position.left,
    top: position.top,
    originX: 'center',
    originY: 'center',
    height: 10,
    width: 10,
    fill: 'white',
    opacity: _opacity,
    angle: leftOf50 ? 270 : 90,
  });
  canvas.add(arrow);
  arrow.sendToBack();
}

export default YardLinePainter;
