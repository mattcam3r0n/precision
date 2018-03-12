import PathUtils from './PathUtils';
import StepType from '/client/lib/StepType';
import FieldDimensions from '/client/lib/FieldDimensions';
import { StepPoint } from '/client/lib/Point';
import SelectionBox from './SelectionBox';
import FileIndicator from './FileIndicator';
import GuidePath from './GuidePath';
import ScriptBuilder from '/client/lib/drill/ScriptBuilder';
import Action from '/client/lib/drill/Action';

class PathTool {
    constructor(field, memberSelection, turnMode, strideType) {
        this.turnMode = turnMode || 'block'; // file | block | rank
        this.strideType = strideType;
        this.field = field;
        this.memberSelection = memberSelection;
        this.selectionBox = null;
        this.guides = [];
        this.guidePaths = [];

        this.createSelectionBox();
        this.createGuides();

        this.allFiles = true; // TEMP
        this.onMouseMoveHandler = this.onMouseMove.bind(this);
        this.field.canvas.on('mouse:move', this.onMouseMoveHandler);
    }

    createSelectionBox() {
        if (this.selectionBox) {
            destroySelectionBox();
        }

        if (this.isEmptySelection()) {
            return;
        }

        // get box coords from selection
        let ul = this.memberSelection.getUpperLeft().toFieldPoint();
        let br = this.memberSelection.getBottomRight().toFieldPoint();

        this.selectionBox = new SelectionBox({
            left: ul.x - FieldDimensions.marcherWidth,
            top: ul.y - FieldDimensions.marcherHeight,
            height: (br.y - ul.y) + (FieldDimensions.marcherHeight * 2),
            width: (br.x - ul.x) + (FieldDimensions.marcherWidth * 2),
        });
        this.field.canvas.add(this.selectionBox);
    }

    destroySelectionBox() {
        this.field.canvas.remove(this.selectionBox);
    }

    isEmptySelection() {
        return !this.memberSelection
            || this.memberSelection.members.length == 0;
    }

    setCurrentTurnDirection(dir) {
        this.currentDir = dir;
        this.guidePaths.forEach((gp) => gp.setCurrentTurnDirection(dir));
    }

    createGuides() {
        if (this.isEmptySelection()) {
            return;
        }

        if (this.turnMode == 'file') {
            return this.createFileGuides();
        }

        if (this.turnMode == 'rank') {
            return this.createRankGuides();
        }

        this.createBlockGuides();
    }

    destroyGuides() {
        if (!this.guides) return;
        this.guides.forEach((g) => {
            this.field.canvas.remove(g);
        });
        this.guides = [];
    }

    createFileGuides() {
        let files = this.memberSelection.fileSelector.findFiles();
        files.forEach((f) => {
            let points = f.getLinePoints()
                .map((p) => new StepPoint(f.leader.member.currentState.strideType, // eslint-disable-line max-len
                    p.x, p.y)
                    .toFieldPoint());

            let fi = new FileIndicator(points,
                f.leader.member.currentState.direction);

            let gp = new GuidePath(this.field, f, {
                strideType: f.leader.member.currentState.strideType,
                stepType: f.leader.member.currentState.stepType,
                direction: f.leader.member.currentState.direction,
                x: f.leader.member.currentState.x,
                y: f.leader.member.currentState.y,
            }, this.strideType);

            // gp.onGuideLineCreated = this.onGuideLineCreated.bind(this);

            this.field.canvas.add(fi);
            this.guides.push(fi);
            this.guidePaths.push(gp);
        });
    }

    onGuideLineCreated(guidePath, point) {
        if (this.allFiles) {
            // console.log('PathTool onGuideLineCreated', point);
            // console.log('guidepaths', this.guidePaths);
            let i = 1;
            this.guidePaths
                .filter((gp) => gp != guidePath)
                .forEach((gp) => {
                    console.log(i, gp.lastPoint, point);
                    gp.createGuideline(gp.lastPoint, point);
                    i++;
                });
        }
    }

    onMouseMove(evt) {
        const adjustedPoint = this.field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
        });
        const activeGuidePath = this.findGuidePath(adjustedPoint);
        console.log('pathTool mousemove', activeGuidePath);

        // if not gp, clear guildelines and exit
        if (!activeGuidePath) {
            console.log('null gp');
            this.destroyGuidePaths();
            return;
        }

        if (this.allFiles) {
            let i = 0;
            const stepSize = FieldDimensions.getStepSize(this.strideType);
            this.guidePaths
                .forEach((gp) => {
            
                    const offsetPoint = {
                        x: adjustedPoint.x + (i * 2 * stepSize.x),
                        y: adjustedPoint.y + (i * 2 * stepSize.y),
                    };
            console.log('offsetPoint', offsetPoint);
                    const snappedPoint = PathUtils.snapPoint(this.strideType,
                        gp.lastPoint, offsetPoint);
                    gp.createGuideline(gp.lastPoint, snappedPoint);
                    i += 1;
                });
        } else {
            const snappedPoint = PathUtils.snapPoint(this.strideType,
                activeGuidePath.lastPoint, adjustedPoint);
            activeGuidePath.createGuideline(activeGuidePath.lastPoint, snappedPoint);
        }
        // draw guideline
        // if all mode, 
        // for each gp
        // calc point
        // draw guideline

        this.field.update();
    }

    createBlockGuides() {
        let files = this.memberSelection.fileSelector.findFiles();
        let sortedLeaderPositions = files
            .map((f) => f.leader.member.currentState)
            .sort((a, b) => {
                if (a.x < b.x || a.y < b.y) {
                    return -1;
                }
                if (a.x > b.x || a.y > b.y) {
                    return 1;
                }
                return 0;
            });
        let file = files[0];
        let guide = sortedLeaderPositions[0];
        let fi = new FileIndicator([new StepPoint(guide.strideType,
            guide.x, guide.y).toFieldPoint()], guide.direction);

        let gp = new GuidePath(this.field, file, {
            strideType: file.leader.member.currentState.strideType,
            stepType: file.leader.member.currentState.stepType,
            direction: file.leader.member.currentState.direction,
            x: file.leader.member.currentState.x,
            y: file.leader.member.currentState.y,
        }, this.strideType);

        this.field.canvas.add(fi);
        this.guides.push(fi);
        this.guidePaths.push(gp);
    }

    createRankGuides() {

    }

    destroyGuidePaths() {
        if (!this.guidePaths) return;

        this.guidePaths.forEach((gp) => gp.dispose());
    }

    findGuidePath(stepPoint) {
        return this.guidePaths.find((p) => p.isInPath(stepPoint));
    }

    addTurnMarker(turnDirection, stepPoint) {
        let guidePath = this.findGuidePath(stepPoint);

        // don't allow turn to be added if not on a guidepath
        if (!guidePath) return;

        turnDirection = turnDirection == undefined
            ? guidePath.lastPoint.direction
            : turnDirection;

        // if (turnDirection == Direction.CM) {
        //   return addCounterMarchMarker(guidePath, stepPoint);
        // }

        // add turn to guidepath
        guidePath.add({
            x: stepPoint.x,
            y: stepPoint.y,
            direction: turnDirection,
            strideType: this.strideType,
            stepType: StepType.Full,
        });
    }

    removeTurnMarker(marker) {
        this.guidePaths.forEach((gp) => gp.removeTurnMarker(marker));
    }

    save() {
        if (!this.guidePaths) return;

        if (this.turnMode == 'file') {
            this.saveFileMode();
        } else {
            this.saveBlockMode();
        }
    }

    saveBlockMode() {
        this.guidePaths.forEach((gp) => {
            let count = gp.startCount + 1;
            if (gp.points.length > 1) {
                let action = new Action(gp.initialPoint);
                this.memberSelection.members.forEach((m) => {
                    ScriptBuilder.addActionAtCount(m, action, count);
                });
                // for each point in guide path
                gp.points.slice(1).forEach((p) => { // skip first point, since it is current position
                    count = count + p.stepsFromPrevious;
                    let action = new Action(p);
                    this.memberSelection.members.forEach((m) => {
                        ScriptBuilder.addActionAtCount(m, action, count);
                    });
                });
            }
        });
    }

    saveFileMode() {
        this.guidePaths.forEach((gp) => {
            if (gp.points.length > 1) {
                // for each file member
                gp.file.fileMembers.forEach((fm) => {
                    let action = new Action(gp.initialPoint);
                    ScriptBuilder.addActionAtPoint(fm.member, action,
                        gp.initialPoint);
                    // for each point in guide path
                    gp.points.slice(1).forEach((p) => { // skip first point, since it is current position
                        let action = new Action(p);
                        ScriptBuilder.addActionAtPoint(fm.member, action, p);
                    });
                });
            }
        });
    }

    dispose() {
        this.destroyGuides();
        this.destroySelectionBox();
        this.destroyGuidePaths();
        this.field.canvas.off('mouse:move', this.onMouseMoveHandler);
    }
}

export default PathTool;
