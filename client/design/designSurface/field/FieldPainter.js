import FieldDimensions from '/client/lib/FieldDimensions';
import YardLinePainter from './YardLinePainter';
import GridPainter from './GridPainter';

class FieldPainter {
  constructor(canvas) {
    this.canvas = canvas;
    this.gridPainter = new GridPainter(canvas);
    this.strideType = 0;
    this._isGridVisible = false;
    this._isLogoVisible = false;
  }

  dispose() {
    this.canvas.remove(this.logo);
  }

  paint() {
    YardLinePainter.paint(this.canvas);
    this.isGridVisible ? this.showGrid(this.strideType) : this.hideGrid();
    this.isLogoVisible ? this.showFieldLogo() : this.hideFieldLogo();
    this.canvas.renderAll();
  }

  get isLogoVisible() {
    return this._isLogoVisible;
  }

  set isLogoVisible(val) {
    this._isLogoVisible = val;
    if (val) {
      this.showFieldLogo();
    } else {
      this.hideFieldLogo();
    }
    this.canvas.renderAll();
  }

  showFieldLogo() {
    let self = this;
    let scaleFactor = 0.75;
    fabric.Image.fromURL('/field-logo.png', function(img) {
      // destroy logo is already exists
      if (self.logo) self.canvas.remove(self.logo);
      self.logo = img;
      img.isLogo = true;
      img.scale(scaleFactor);
      img.selectable = false;
      img.evented = false;
      img.set('left', FieldDimensions.width / 2 - img.width * scaleFactor / 2);
      img.set('top', FieldDimensions.height / 2 - img.height * scaleFactor / 2);
      img.set('opacity', 0.2);
      img.hoverCursor = 'default';
      self.canvas.add(img);

      // img.on('mouseover', function() {
      //     img.set('opacity', .15);
      //     img.sendToBack();
      // });

      // img.on('mouseout', function() {
      //     img.set('opacity', .25);
      //     img.sendToBack();
      // });

      self.canvas.renderAll();
    });
  }

  hideFieldLogo() {
    this.canvas.remove(this.logo);
  }

  get isGridVisible() {
    return this._isGridVisible;
  }

  set isGridVisible(val) {
    this._isGridVisible = val;
    if (val) {
      this.showGrid(this.strideType);
    } else {
      this.hideGrid();
    }
  }

  showGrid(strideType) {
    this.strideType = strideType;
    this.gridPainter.showGrid(strideType);
  }

  hideGrid() {
    this.gridPainter.removeGrid();
  }
}

export default FieldPainter;
