import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';

var _marcherOffsetX = FieldDimensions.marcherWidth / 2,
    _marcherOffsetY = FieldDimensions.marcherHeight / 2;

// limit to min of 1 x 1
var minWidth = FieldDimensions.marcherWidth + 10,
    minHeight = FieldDimensions.marcherHeight + 10;

// limit to max of aprox ~16 x 16
var maxWidth = FieldDimensions.marcherWidth * 20,
    maxHeight = FieldDimensions.marcherHeight * 20;

class SizableRect {
    constructor(field) {
        this.field = field;
        this.rect = createRect(field.canvas);
        this.sizingHandle = createSizingHandle(field.canvas);

        this.rect.on('moving', evt => {
            // snap rect to step grid
            var p = FieldDimensions.snapPoint(StrideType.SixToFive, { x: this.rect.left, y: this.rect.top });
            this.rect.set('left', p.x - this.marcherOffsetX);
            this.rect.set('top', p.y - this.marcherOffsetY);
            this.rect.setCoords();

            // adjust handle position
            this.sizingHandle.set('left', this.rect.left + this.rect.width);
            this.sizingHandle.set('top', this.rect.top + this.rect.height);
            this.sizingHandle.setCoords();

            field.canvas.trigger('sizableRect:moving', this.rect);
        });

        this.sizingHandle.on('moving', evt => {
            var width = this.sizingHandle.left - this.rect.left;
            var height = this.sizingHandle.top - this.rect.top;

            // enforce limits
            width = width < minWidth ? minWidth : width;
            height = height < minHeight ? minHeight :height;
            width = width > maxWidth ? maxWidth : width;
            height = height > maxHeight ? maxHeight : height;

            this.rect.set('width', width);
            this.rect.set('height', height );
            this.rect.setCoords();

            this.sizingHandle.set('left', this.rect.left + width);
            this.sizingHandle.set('top', this.rect.top + height);
            this.sizingHandle.setCoords();

            field.canvas.trigger('sizableRect:sizing', this.rect);
        });

    }

    get marcherOffsetX() {
        return FieldDimensions.marcherWidth / 2;
    }

    get marcherOffsetY() {
        return FieldDimensions.marcherHeight / 2;
    }

    get left() {
        return this.rect.left;
    }

    get top() {
        return this.rect.top;
    }

    get width() {
        return this.rect.width;
    }

    get height() {
        return this.rect.height;
    }

    position() {
        return { left: this.left + this.marcherOffsetX, top: this.top + this.marcherOffsetY };
    }

    destroy() {
        this.field.canvas.remove(this.rect);
        this.field.canvas.remove(this.sizingHandle);
        this.rect = null;
        this.sizingHandle = null;
    }
}

function createSizingHandle(canvas) {
    var rect = new fabric.Rect({
        left: FieldDimensions.fiftyYardlineX - _marcherOffsetX + 100,
        top: FieldDimensions.farSidelineY - _marcherOffsetY + 100,
        width: 15,
        height: 15,
        fill: 'darkgray',
        stroke: 'black',
        strokeWidth: 1,
        opacity: 1,
        selectable: true,
        hasControls: false,
        angle: 45,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'nwse-resize',
        moveCursor: 'nwse-resize'
      });
      canvas.add(rect);  
      rect.bringToFront();
    return rect;
}

function createRect(canvas) {
    var rect = new fabric.Rect({
      left: FieldDimensions.fiftyYardlineX - _marcherOffsetX,
      top: FieldDimensions.farSidelineY - _marcherOffsetY,
      width: 100,
      height: 100,
      fill: 'rgba(0,0,0,0)',
      stroke: 'black',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      opacity: .5,
      selectable: true,
      hasControls: false
    });
    canvas.add(rect);
//    canvas.setActiveObject(rect);
    return rect;
}


export default SizableRect;
