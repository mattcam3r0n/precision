import JsPDF from 'jspdf';
import FieldPainter from '/client/design/designSurface/field/FieldPainter';
import FieldDimensions from '/client/lib/FieldDimensions';
import MarcherFactory from '../design/designSurface/field/MarcherFactory';
import PointSet from '/client/lib/PointSet';
import MemberPositionCalculator from './drill/MemberPositionCalculator';

class printService {
  constructor(appStateService) {
    this.appStateService = appStateService;
  }

  pdfTest() {
    const counts = 72;
    const doc = new JsPDF('landscape', 'mm', 'a4');

    const canvasEl = document.createElement('canvas');
    const canvas = new fabric.Canvas(canvasEl, {
      // backgroundColor: '#40703B', // huntergreen //'green',
      height: FieldDimensions.height,
      width: FieldDimensions.width,
      uniScaleTransform: true,
      renderOnAddRemove: false, // performance optimization
    });

    this.addTitle(doc);
    this.addCounts(doc, counts);
    this.addNotes(doc);
    this.drawField(doc, canvas, counts);

    // doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  printChart(count, notes, forecastCounts) {
    const doc = new JsPDF('landscape', 'mm', 'letter');
    const canvasEl = document.createElement('canvas');
    const canvas = new fabric.Canvas(canvasEl, {
      // backgroundColor: '#40703B', // huntergreen //'green',
      height: FieldDimensions.height,
      width: FieldDimensions.width,
      uniScaleTransform: true,
      renderOnAddRemove: false, // performance optimization
    });

    this.addTitle(doc);
    this.addCounts(doc, forecastCounts);
    this.addNotes(doc, notes);
    this.drawField(doc, canvas, forecastCounts);

    // doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  addTitle(doc) {
    doc.setFontSize(22);
    doc.text(10, 20, this.appStateService.drill.name);
  }

  addCounts(doc, counts) {
    const count = this.appStateService.drill.count;
    // const left = doc.internal.pageSize.width * .75;
    const label = 'Counts ' + count + ' - ' + (count + counts);
    doc.setFontSize(16);
    const leftOffset =
      doc.internal.pageSize.width -
      doc.getStringUnitWidth(label) * doc.internal.getFontSize() / 2;
    console.log('page width', doc.internal.pageSize.width);
    console.log('string unit width', doc.getStringUnitWidth(label));
    console.log('font size', doc.internal.getFontSize());
    doc.text(leftOffset, 20, label);
  }

  addNotes(doc, notes) {
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(
      notes,
      doc.internal.pageSize.width - 20
    );
    doc.text(10, 30, splitText);
  }

  drawField(doc, canvas, counts) {
    const painter = new FieldPainter(canvas, {
      // fill: 'black',
      stroke: 'gray',
    });
    painter.paint();

    const width = doc.internal.pageSize.width;
    const height = width / 2; // doc.internal.pageSize.height;

    this.drawFootrints(canvas, counts);
    this.drawMarchers(canvas);

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    doc.addImage(imgData, 'JPEG', 0, 50, width, height);
  }

  drawMarchers(canvas) {
    this.appStateService.drill.members.forEach((m) => {
      canvas.add(
        MarcherFactory.createMarcher(m.currentState, {
          fill: 'gray',
        })
      );
    });
  }

  drawFootrints(canvas, counts) {
    // for each member
    // for N counts
    // calc position
    // add point to pointset
    const pointSet = new PointSet();
    this.appStateService.drill.members.forEach((m) => {
      let pos = m.currentState;
      for (let count = 0; count < counts; count++) {
        pos = MemberPositionCalculator.stepForward(m, pos, 1);
        pointSet.add({ x: pos.x, y: pos.y });
      }
    });
    pointSet.points.forEach((p) => {
      canvas.add(
        new fabric.Circle({
          originX: 'center',
          originY: 'center',
          left: p.x,
          top: p.y,
          radius: 2,
          fill: 'black',
          stroke: 'black',
          opacity: 0.3,
        })
      );
    });
  }
}

angular
  .module('drillApp')
  .service('printService', ['appStateService', printService]);
