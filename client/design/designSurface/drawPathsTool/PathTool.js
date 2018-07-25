import PathUtils from './PathUtils';
import StepType from '/client/lib/StepType';
import StepDelta from '/client/lib/StepDelta';
import FieldDimensions from '/client/lib/FieldDimensions';
import { FieldPoint, StepPoint } from '/client/lib/Point';
import SelectionBox from './SelectionBox';
import FileIndicator from './FileIndicator';
import GuidePath from './GuidePath';
import ScriptBuilder from '/client/lib/drill/ScriptBuilder';
import Action from '/client/lib/drill/Action';
import ExceptionHelper from '/client/lib/ExceptionHelper';

class PathTool {
    constructor(field, memberSelection, turnMode, strideType,
        allFiles, fileOffset, rankOffset) {
        this.turnMode = turnMode || 'block'; // file | block | rank
        this.strideType = strideType;
        this.allFiles = allFiles || false;
        this.fileOffset = fileOffset || 0;
        this.rankOffset = rankOffset || 0;
        this.field = field;
        this.memberSelection = memberSelection;
        this.selectionBox = null;
        this.guides = [];
        this.guidePaths = [];

        this.createSelectionBox();
        this.createGuides();

        this.onMouseMoveHandler = this.onMouseMove.bind(this);
        this.field.canvas.on('mouse:move', this.onMouseMoveHandler);

        this.onMouseUpHandler = this.onMouseUp.bind(this);
        this.field.canvas.on('mouse:up', this.onMouseUpHandler);
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

    setFileOffset(offset) {
        this.fileOffset = offset;
    }

    setRankOffset(offset) {
        this.rankOffset = offset;
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
                f.leader.direction);

            let gp = new GuidePath(this.field, f, {
                strideType: f.leader.member.currentState.strideType,
                stepType: f.leader.member.currentState.stepType,
                direction: f.leader.direction,
                x: f.leader.member.currentState.x,
                y: f.leader.member.currentState.y,
            }, this.strideType);

            this.field.canvas.add(fi);
            this.guides.push(fi);
            this.guidePaths.push(gp);
        });
    }

    onMouseMove(evt) {
        const adjustedPoint = this.field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
        });
        const activeGuidePath = this.findGuidePath(adjustedPoint);

        // if not gp, clear guildelines and exit
        if (!activeGuidePath) {
            this.destroyGuideLines();
            return;
        }

        if (this.allFiles) {
            this.createAllFileGuidelines(adjustedPoint);
        } else {
            const snappedPoint = PathUtils.snapPoint(this.strideType,
                activeGuidePath.lastPoint, adjustedPoint);
            activeGuidePath.createGuideline(activeGuidePath.lastPoint,
                snappedPoint);
        }

        this.field.update();
    }

    onMouseUp(evt) {
        ExceptionHelper.handle(() => {
          if (!evt.isClick) return;
          if (evt.target !== null && !evt.target.isLogo) return; // clicked on an object
          // have to adjust point for zoom
          let adjustedPoint = this.field.adjustMousePoint({
            x: evt.e.layerX,
            y: evt.e.layerY,
          });
          if (this.allFiles) {
            this.addAllFileTurnMarkers(this.currentDir, adjustedPoint);
          } else {
            let stepPoint = new FieldPoint(adjustedPoint); // .toStepPoint(ctrl.strideType);
            // add turn at step point
            this.addTurnMarker(this.currentDir, stepPoint);
          }
        }, 'PathTool.onMouseUp', {

        });
    }

    calculateAllFileTurnPoints(adjustedPoint) {
        const stepSize = FieldDimensions.getStepSize(this.strideType);
        return this.guidePaths
            .map((gp, i) => {
                const offsetPoint = {
                    x: adjustedPoint.x + (i * this.fileOffset * stepSize.x),
                    y: adjustedPoint.y + (i * this.fileOffset * stepSize.y),
                };
                const snappedPoint = PathUtils.snapPoint(this.strideType,
                    gp.lastPoint, offsetPoint);
                return snappedPoint;
            });
    }

    offsetPoint(point, dir, steps) {
        if (steps == 0) return point;
        const delta = StepDelta.getDelta(this.strideType,
            StepType.Full, dir, steps);
        return {
            x: point.x + delta.deltaX,
            y: point.y + delta.deltaY,
            direction: point.direction,
        };
    }

    createAllFileGuidelines(adjustedPoint) {
        const points = this.calculateAllFileTurnPoints(adjustedPoint);
        this.guidePaths.forEach((gp, i) => {
            gp.createGuideline(gp.lastPoint, points[i]);
        });
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
            direction: file.direction,
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

    destroyGuideLines() {
        if (!this.guidePaths) return;

        this.guidePaths.forEach((gp) => gp.destroyGuideline());
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

        // add turn to guidepath
        guidePath.add({
            x: stepPoint.x,
            y: stepPoint.y,
            direction: turnDirection,
            strideType: this.strideType,
            stepType: StepType.Full,
        });
    }

    addAllFileTurnMarkers(turnDirection, adjustedPoint) {
        const points = this.calculateAllFileTurnPoints(adjustedPoint);
        points.forEach((p) => this.addTurnMarker(turnDirection, p));
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
        // for each guidepath
        //      const gpSeq = gp.getScriptSequence();
        //      for each gp.fileMember
        //          clone sequence
        //          if allFiles && rankOffset
        //              insert rank delay... rank * rankOffset
        //          ftlOffset += getStepsToLeader;
        //          insert FTL offset...
        this.guidePaths.forEach((gp) => {
            const gpSeq = gp.getScriptSequence();
            let ftlOffset = 0;
            gp.file.fileMembers.forEach((fm, rank) => {
                const seq = gpSeq.clone();
                ftlOffset += fm.getStepsToLeader();
                // inserting undefined will tell the member to continue
                // doing whatever is currently in their script for those counts
                seq.insertUndefined(ftlOffset, 0);
                if (this.allFiles && this.rankOffset) {
                    if (this.rankOffset < 0) {
                        seq.deleteCount(Math.abs(rank * this.rankOffset));
                    } else {
                        seq.insertUndefined(rank * this.rankOffset, 1);
                    }
                }
                ScriptBuilder.insertSequence(fm.member, seq.getSequence(),
                    gp.startCount + 1);
            });
        });
    }

    dispose() {
        this.destroyGuides();
        this.destroySelectionBox();
        this.destroyGuidePaths();
        this.field.canvas.off('mouse:move', this.onMouseMoveHandler);
        this.field.canvas.off('mouse:up', this.onMouseUpHandler);
    }
}

export default PathTool;
