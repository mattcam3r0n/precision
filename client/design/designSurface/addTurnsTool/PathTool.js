import StrideType from '/client/lib/StrideType';
import StepType from '/client/lib/StepType';
import FieldDimensions from '/client/lib/FieldDimensions';
import { StepPoint, FieldPoint } from '/client/lib/Point';
import SelectionBox from './SelectionBox';
import FileIndicator from './FileIndicator';
import GuidePath from './GuidePath';

class PathTool {
    constructor(field, memberSelection, turnMode) {
        this.turnMode = turnMode || 'block'; // file | block | rank
        this.field = field;
        this.memberSelection = memberSelection;
        this.selectionBox = null;
        this.guides = [];
        this.guidePaths = [];

        this.createSelectionBox();
        this.createGuides();
    }

    createSelectionBox() {
        if (this.selectionBox)
            destroySelectionBox();

        // get box coords from selection
        var ul = this.memberSelection.getUpperLeft().toFieldPoint();
        var br = this.memberSelection.getBottomRight().toFieldPoint();
        this.selectionBox = new SelectionBox({
            left: ul.x - FieldDimensions.marcherWidth,
            top: ul.y - FieldDimensions.marcherHeight,
            height: (br.y - ul.y) + (FieldDimensions.marcherHeight * 2),
            width: (br.x - ul.x) + (FieldDimensions.marcherWidth * 2)
        });
        this.field.canvas.add(this.selectionBox);
    }

    destroySelectionBox() {
        this.field.canvas.remove(this.selectionBox);
    }   

    createGuides() {
        if (this.turnMode == 'file') 
            return this.createFileGuides();
        
        if (this.turnMode == 'rank')
            return this.createRankGuides();

        this.createBlockGuides();
    }

    destroyGuides() {
        if (!this.guides) return;
        this.guides.forEach(g => {
            this.field.canvas.remove(g);
        });
        this.guides = [];
    }    

    createFileGuides() {
        var files = this.memberSelection.fileSelector.findFiles();
        files.forEach(f => {
            let points = f.getLinePoints().map(p => new StepPoint(f.leader.member.currentState.strideType, p.x, p.y).toFieldPoint());
            
            let fi = new FileIndicator(points, f.leader.member.currentState.direction);

            let gp = new GuidePath(this.field, f, {
                strideType: f.leader.member.currentState.strideType,
                stepType: f.leader.member.currentState.stepType,
                direction: f.leader.member.currentState.direction,
                x: f.leader.member.currentState.x,
                y: f.leader.member.currentState.y
              });

            this.field.canvas.add(fi);
            this.guides.push(fi);
            this.guidePaths.push(gp);
        });
    }

    createBlockGuides() {
        var files = this.memberSelection.fileSelector.findFiles();
        var sortedLeaderPositions = files
            .map(f => f.leader.member.currentState)
            .sort((a,b) => {
                if (a.x < b.x || a.y < b.y)
                    return -1;
                if (a.x > b.x || a.y > b.y)
                    return 1;
                return 0;
            });
    
        var file = files[0];
        var guide = sortedLeaderPositions[0];
        var fi = new FileIndicator([new StepPoint(guide.strideType, guide.x, guide.y).toFieldPoint()], guide.direction);

        var gp = new GuidePath(this.field, file, {
            strideType: file.leader.member.currentState.strideType,
            stepType: file.leader.member.currentState.stepType,
            direction: file.leader.member.currentState.direction,
            x: file.leader.member.currentState.x,
            y: file.leader.member.currentState.y
          });

        this.field.canvas.add(fi);
        this.guides.push(fi);
        this.guidePaths.push(gp);

        // file = files[files.length - 1];
        // guide = sortedLeaderPositions[sortedLeaderPositions.length - 1];
        // fi = new FileIndicator([new StepPoint(guide.strideType, guide.x, guide.y).toFieldPoint()], guide.direction);

        // gp = new GuidePath(this.field, file, {
        //     strideType: file.leader.member.currentState.strideType,
        //     stepType: file.leader.member.currentState.stepType,
        //     direction: file.leader.member.currentState.direction,
        //     x: file.leader.member.currentState.x,
        //     y: file.leader.member.currentState.y
        //   });

        // this.field.canvas.add(fi);
        // this.guides.push(fi);
        // this.guidePaths.push(gp);
    
    }

    createRankGuides() {

    }

    destroyGuidePaths() {
        if (!this.guidePaths) return;
        
        this.guidePaths.forEach(gp => gp.dispose());        
    }

    findGuidePath(stepPoint) {
        return this.guidePaths.find(p => p.isInPath(stepPoint));
    }

    addTurnMarker(turnDirection, stepPoint) {
        var guidePath = this.findGuidePath(stepPoint);

        // don't allow turn to be added if not on a guidepath
        if (!guidePath) return;

        turnDirection = turnDirection == undefined ? guidePath.lastPoint.direction : turnDirection;

        // if (turnDirection == Direction.CM) {
        //   return addCounterMarchMarker(guidePath, stepPoint);
        // }

        // add turn to guidepath
        guidePath.add({
          x: stepPoint.x,
          y: stepPoint.y,
          direction: turnDirection,
          strideType: StrideType.SixToFive,
          stepType: StepType.Full
        });   
    }
    

    dispose() {
        this.destroyGuides();
        this.destroySelectionBox();
        this.destroyGuidePaths();
    }
}

export default PathTool;