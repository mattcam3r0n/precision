import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';

class SizableRect {
    constructor(field) {
        this.sizableRect = createRect(field.canvas);
        this.sizingHandle = createSizingHandle(field.canvas);

        this.sizableRect.on('moving', evt => {
            // snap rect to step grid
            var p = FieldDimensions.snapPoint(StrideType.SixToFive, { x: this.sizableRect.left, y: this.sizableRect.top });
            this.sizableRect.set('left', p.x);
            this.sizableRect.set('top', p.y);
            this.sizableRect.setCoords();

            // adjust handle position
            this.sizingHandle.set('left', this.sizableRect.left + this.sizableRect.width);
            this.sizingHandle.set('top', this.sizableRect.top + this.sizableRect.height);
            this.sizingHandle.setCoords();
        });

        this.sizingHandle.on('moving', evt => {
            this.sizableRect.set('width', this.sizingHandle.left - this.sizableRect.left);
            this.sizableRect.set('height', this.sizingHandle.top - this.sizableRect.top);
            this.sizableRect.setCoords();
        });

    }
}

function createSizingHandle(canvas) {
    var rect = new fabric.Rect({
        left: 300,
        top: 300,
        width: 10,
        height: 10,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1,
        opacity: 1,
        selectable: true,
        hasControls: false,
      });
      canvas.add(rect);  
    return rect;
}

function createRect(canvas) {
    var rect = new fabric.Rect({
      left: 200,
      top: 200,
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

    return rect;
}


export default SizableRect;
