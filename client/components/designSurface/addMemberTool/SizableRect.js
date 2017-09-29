import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';

var marcherOffsetX = FieldDimensions.marcherWidth / 2,
    marcherOffsetY = FieldDimensions.marcherHeight / 2;

class SizableRect {
    constructor(field) {
        this.field = field;
        this.rect = createRect(field.canvas);
        this.sizingHandle = createSizingHandle(field.canvas);

        this.rect.on('moving', evt => {
            // snap rect to step grid
            var p = FieldDimensions.snapPoint(StrideType.SixToFive, { x: this.rect.left, y: this.rect.top });
            this.rect.set('left', p.x - marcherOffsetX);
            this.rect.set('top', p.y - marcherOffsetY);
            this.rect.setCoords();

            // adjust handle position
            this.sizingHandle.set('left', this.rect.left + this.rect.width);
            this.sizingHandle.set('top', this.rect.top + this.rect.height);
            this.sizingHandle.setCoords();

            field.canvas.trigger('sizableRect:moving', this.rect);
        });

        this.sizingHandle.on('moving', evt => {
            this.rect.set('width', this.sizingHandle.left - this.rect.left);
            this.rect.set('height', this.sizingHandle.top - this.rect.top);
            this.rect.setCoords();

            field.canvas.trigger('sizableRect:sizing', this.rect);
        });

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

    destroy() {
        this.field.canvas.remove(this.rect);
        this.field.canvas.remove(this.sizingHandle);
        this.rect = null;
        this.sizingHandle = null;
    }
}

function createSizingHandle(canvas) {
    var rect = new fabric.Rect({
        left: FieldDimensions.goallineX - marcherOffsetX + 100,
        top: FieldDimensions.farSidelineY - marcherOffsetY + 100,
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
    return rect;
}

function createRect(canvas) {
    var rect = new fabric.Rect({
      left: FieldDimensions.goallineX - marcherOffsetX,
      top: FieldDimensions.farSidelineY - marcherOffsetY,
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
