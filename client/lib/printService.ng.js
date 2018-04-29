import JsPDF from 'jspdf';
import FieldPainter from '/client/design/designSurface/field/FieldPainter';
import FieldDimensions from '/client/lib/FieldDimensions';

class printService {
  constructor() {}

  pdfTest() {
    const doc = new JsPDF('landscape', 'mm', 'a4');
    doc.setFontSize(22);
    doc.text(20, 20, 'Example');

    const canvasEl = document.createElement('canvas');
    const canvas = new fabric.Canvas(canvasEl, {
        // backgroundColor: '#40703B', // huntergreen //'green',
        height: FieldDimensions.height,
        width: FieldDimensions.width,
        uniScaleTransform: true,
        renderOnAddRemove: false, // performance optimization
    });

    this.drawField(doc, canvas);

    // doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  drawField(doc, canvas) {
    const painter = new FieldPainter(canvas, {
        // fill: 'black',
        stroke: 'gray',
    });
    painter.paint();

    const width = doc.internal.pageSize.width;
    const height = width / 2; // doc.internal.pageSize.height;
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    doc.addImage(imgData, 'JPEG', 0, 50, width, height);
  }
}

angular.module('drillApp').service('printService', [printService]);
