import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';

var marcherOffsetX = FieldDimensions.marcherWidth / 2,
    marcherOffsetY = FieldDimensions.marcherHeight / 2;

class SizableRect {
    constructor(field) {
        this.sizableRect = createRect(field.canvas);
        this.sizingHandle = createSizingHandle(field.canvas);

        this.sizableRect.on('moving', evt => {
            // snap rect to step grid
            var p = FieldDimensions.snapPoint(StrideType.SixToFive, { x: this.sizableRect.left, y: this.sizableRect.top });
            this.sizableRect.set('left', p.x - marcherOffsetX);
            this.sizableRect.set('top', p.y - marcherOffsetY);
            this.sizableRect.setCoords();

            // adjust handle position
            this.sizingHandle.set('left', this.sizableRect.left + this.sizableRect.width);
            this.sizingHandle.set('top', this.sizableRect.top + this.sizableRect.height);
            this.sizingHandle.setCoords();

            field.canvas.trigger('sizableRect:moving', this.sizableRect);
        });

        this.sizingHandle.on('moving', evt => {
            this.sizableRect.set('width', this.sizingHandle.left - this.sizableRect.left);
            this.sizableRect.set('height', this.sizingHandle.top - this.sizableRect.top);
            this.sizableRect.setCoords();

            field.canvas.trigger('sizableRect:sizing', this.sizableRect);
        });

    }

    get left() {
        return this.sizableRect.left;
    }

    get top() {
        return this.sizableRect.top;
    }

    get width() {
        return this.sizableRect.width;
    }

    get height() {
        return this.sizableRect.height;
    }
}

function createSizingHandle(canvas) {
    var rect = new fabric.Rect({
        left: FieldDimensions.goallineX - marcherOffsetX + 100,
        top: FieldDimensions.farSidelineY - marcherOffsetY + 100,
        width: 12,
        height: 12,
        fill: 'darkgray',
        stroke: 'black',
        strokeWidth: 1,
        opacity: 1,
        selectable: true,
        hasControls: false,
        angle: 45,
        originX: 'center',
        originY: 'center'
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
    canvas.setActiveObject(rect);
    return rect;
}


export default SizableRect;
