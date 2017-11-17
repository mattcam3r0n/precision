import FieldDimensions from '/client/lib/FieldDimensions';

var _sidelinePosition = {
	0 : "far sideline",
	1 : "far hashmark",
	2 : "near hashmark",
	3 : "near sideline"
};

var _sidelinePositionY = [ 
    FieldDimensions.farSidelineY, 
    FieldDimensions.farHashY, 
    FieldDimensions.nearHashY, 
    FieldDimensions.nearSidelineY ];
 
var _yardlinePosition = {
	0 : "left endzone",
	1 : "left endzone",
	2 : "left endzone",
	3 : "goal line",
	4 : "5 yard line",
	5 : "10 yard line",
	6 : "15 line",
	7 : "20 yard line",
	8 : "25 yard line",
	9 : "30 yard line",
	10 : "35 yard line",
	11 : "40 yard line",
	12 : "45 yard line",
	13 : "50 yard line",
	14 : "45 yard line",
	15 : "40 yard line",
	16 : "35 yard line",
	17 : "30 yard line",
	18 : "25 yard line",
	19 : "20 yard line",
	20 : "15 yard line",
	21 : "10 yard line",
	22 : "5 yard line",
	23 : "goal line",
	24 : "right endzone",
	25 : "right endzone",
	26 : "right endzone"
};

class PositionCalculator {

    static getPositionDescription(fieldPoint, strideType) {
		var stepPoint = FieldDimensions.toStepPoint(fieldPoint, strideType);
		return getYardlinePosition(fieldPoint, stepPoint, strideType) + ", " + getSidelinePosition(fieldPoint, stepPoint, strideType) + " (" + stepPoint.x.toFixed(1) + ", " + stepPoint.y.toFixed(1) + ")";
    }
    
}

export default PositionCalculator;

/*
refactor...
just use step point? no field point?
find nearest yardline (step point)? subtract step point to get offset?

 */
function getYardlinePosition(point, stepPoint, strideType) {
	// var yardline = FieldDimensions.width / 26;  // yardline width? or five yards in x terms?
	// var offset = (FieldDimensions.oneStepX_6to5 * 3) - FieldDimensions.fiveYardsX; // neg midpoint? fiveYardsX/2 * -1?
	// var x = Math.floor((point.x - offset) / yardline);
	// var yardlineX = x * FieldDimensions.fiveYardsX;
	// var yardlineSteps = yardlineX; // / FieldDimensions.oneStepX_6to5;
	// var steps = (Math.abs(yardlineSteps - stepPoint.x)) / FieldDimensions.oneStepX_6to5;
	// var position = steps == 0 ? " On the " : steps + " off the ";
	var stepSize = FieldDimensions.getStepSize(strideType);
	var fiveYards = FieldDimensions.fiveYardsX;
	var yardlineIndex = Math.floor((point.x + (fiveYards/2)) / fiveYards);
	var yardlineX = yardlineIndex * fiveYards;
	var steps = (Math.abs(yardlineX - stepPoint.x)) / stepSize.x;
	var position = steps == 0 ? " On the " : steps + " off the ";

	return position + _yardlinePosition[yardlineIndex];
}

function getSidelinePosition(point, stepPoint, strideType) {
	// var quarter = FieldDimensions.height / 4;
	// var y = Math.floor(point.y / quarter);
	// var sidelineY = _sidelinePositionY[y];
	// var sidelineSteps = sidelineY; // / FieldDimensions.oneStepY_6to5;
	// var steps = (Math.abs(sidelineSteps - stepPoint.y)) / FieldDimensions.oneStepY_6to5;
	// var position = steps == 0 ? " On the " : steps + " off the ";

	var stepSize = FieldDimensions.getStepSize(strideType);
	var quarter = FieldDimensions.height / 4;
	//var hashDistance = FieldDimensions.farHashY - FieldDimensions.farSidelineY;
	var sidelineIndex = getSidelineIndex(point); //Math.floor((point.y + (quarter/2)) / quarter);
	var sidelineY = _sidelinePositionY[sidelineIndex];
	var steps = Math.round((Math.abs(sidelineY - stepPoint.y)) / stepSize.y);
	var position = steps == 0 ? " On the " : steps + " off the ";
	
	return position + _sidelinePosition[sidelineIndex];
}

function getSidelineIndex(point) {
	if (point.y <= 170)
		return 0;
	if (point.y <= 390)
		return 1;
	if (point.y <= 610)
		return 2;
	
	return 3;
}