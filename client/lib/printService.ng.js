import JsPDF from 'jspdf';
import FieldPainter from '/client/design/designSurface/field/FieldPainter';
import FieldDimensions from '/client/lib/FieldDimensions';
import MarcherFactory from '../design/designSurface/field/MarcherFactory';
import DrillPlayer from '/client/lib/drill/DrillPlayer';
import DrillBuilder from '/client/lib/drill/DrillBuilder';

class printService {
  constructor(appStateService, instrumentService) {
    this.appStateService = appStateService;
    this.instrumentService = instrumentService;
  }

  printBookmarks(bookmarks, options) {
    options = options || {};
    const doc = new JsPDF('landscape', 'mm', 'letter');
    const canvas = createCanvas();

    const drillPlayer = new DrillPlayer(this.appStateService.drill);

    // remember which count the drill is currently at
    const saveCount = this.appStateService.getDrillCount();

    bookmarks.forEach((b, i) => {
      drillPlayer.goToCount(b.count);
      this.printChart(doc, canvas, b, options);
      if (i < bookmarks.length - 1) {
        doc.addPage();
      }
    });

    // restore drill to saved count
    drillPlayer.goToCount(saveCount);

    // doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  printCurrentCount(bookmark, options) {
    options = options || {};
    const doc = new JsPDF('landscape', 'mm', 'letter');
    const canvas = createCanvas();
    this.printChart(doc, canvas, bookmark, options);
    // doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  printChart(doc, canvas, bookmark, options) {
    // go to count?
    this.addDrillName(doc, this.appStateService.drill.name);
    this.addTitle(doc, bookmark.name);
    this.addCounts(doc, bookmark.forecastCounts);
    this.addNotes(doc, bookmark.notes);
    this.drawField(doc, canvas, bookmark.forecastCounts, options);
    this.drawMarcherLegend(doc, canvas, options);
  }

  addDrillName(doc, name) {
    doc.setFontSize(22);
    doc.text(10, 20, name);
  }

  addTitle(doc, title) {
    title = title || '';
    doc.setFontSize(22);
    const leftOffset =
      (doc.internal.pageSize.width -
        (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor) /
      2;
    doc.text(leftOffset, 20, title);
  }

  addCounts(doc, counts) {
    const count = this.appStateService.drill.count;
    counts = counts || 0;
    // const left = doc.internal.pageSize.width * .75;
    const label = 'Counts ' + count + ' - ' + (count + counts);
    doc.setFontSize(16);
    const leftOffset =
      doc.internal.pageSize.width -
      (doc.getStringUnitWidth(label) * doc.internal.getFontSize()) / 2;
    doc.text(leftOffset, 20, label);
  }

  addNotes(doc, notes) {
    notes = notes || '';
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(
      notes,
      doc.internal.pageSize.width - 20
    );
    doc.text(10, 30, splitText);
  }

  drawField(doc, canvas, counts, options) {
    console.time('drawField');
    console.time('clear canvas');
    canvas.clear();
    console.timeEnd('clear canvas');
    const painter = new FieldPainter(canvas, {
      // fill: 'black',
      stroke: 'gray',
    });
    console.time('field paint');
    painter.paint();
    console.timeEnd('field paint');

    const width = doc.internal.pageSize.width;
    const height = width / 2; // doc.internal.pageSize.height;

    this.drawFootrints(canvas, counts);
    this.drawMarchers(canvas, options);

    console.time('toDataUrl');
    //    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgData = canvas.toDataURL({
      // format: 'jpeg',
      // quality: .8,
      format: 'png',
      multiplier: 0.5,
    });
    // const imgData = getResizedImage(doc, canvas);
    console.timeEnd('toDataUrl');
    console.time('addImage');
    doc.addImage(imgData, 'PNG', 0, 50, width, height);
    console.timeEnd('addImage');
    console.timeEnd('drawField');
  }

  drawMarchers(canvas, options) {
    console.time('drawMarchers');
    this.appStateService.drill.members.forEach((m) => {
      canvas.add(
        MarcherFactory.createMarcher(m.currentState, {
          fill: options.printInColor ? m.color : 'gray',
        })
      );
    });
    console.timeEnd('drawMarchers');
  }

  drawMarcherLegend(doc, canvas, options) {
    if (!options.printInColor) {
      return;
    }
    this.instrumentService.getInstruments().forEach((inst, i) => {
      const row = Math.floor(i / 6);
      const col = i - row * 6;
      const x = col * 40 + 10;
      const y = (doc.internal.pageSize.height - 40) + (10 * row + 10);
      const rgb = hex2rgb(inst.hex || '#FF0000');
      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(rgb.red, rgb.green, rgb.blue);
      doc.rect(x, y, 5, 5, 'FD');

      doc.setFontSize(12);
      doc.text(x + 7, y + 4, inst.name);
    });
  }

  drawFootrints(canvas, counts) {
    console.time('drawFootprints');
    if (counts < 1) return;
    const drillBuilder = new DrillBuilder(this.appStateService.drill);
    const pointSet = drillBuilder.getFootprintPoints(
      this.appStateService.drill.members,
      counts
    );

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
    console.timeEnd('drawFootprints');
  }
}

function createCanvas() {
  console.time('createCanvas');
  const canvasEl = document.createElement('canvas');
  const canvas = new fabric.StaticCanvas(canvasEl, {
    // backgroundColor: '#40703B', // huntergreen //'green',
    height: FieldDimensions.height,
    width: FieldDimensions.width,
    uniScaleTransform: true,
    renderOnAddRemove: false, // performance optimization
  });
  console.timeEnd('createCanvas');
  return canvas;
}

function hex2rgb (hex, opacity) {
  hex = hex.trim();
  hex = hex[0] === '#' ? hex.substr(1) : hex;
  let bigint = parseInt(hex, 16);
  let h = [];
  if (hex.length === 3) {
      h.push((bigint >> 4) & 255);
      h.push((bigint >> 2) & 255);
  } else {
      h.push((bigint >> 16) & 255);
      h.push((bigint >> 8) & 255);
  }
  h.push(bigint & 255);
  // if (arguments.length === 2) {
  //     h.push(opacity);
  //     return 'rgba('+h.join()+')';
  // } else {
  //     return 'rgb('+h.join()+')';
  // }
  return {
    red: h[0],
    green: h[1],
    blue: h[2],
  };
}

angular
  .module('drillApp')
  .service('printService', [
    'appStateService',
    'instrumentService',
    printService,
  ]);
