import FieldDimensions from '/client/lib/FieldDimensions';
import FieldResizer from './FieldResizer';
import YardLinePainter from './YardLinePainter';
import MarcherFactory from './MarcherFactory';

class Field {

    constructor(drill) {
        this.canvas = this.createCanvas();
        
        this.drawField();
        this.addMarchers(drill.members);
        this.resize();
    }

    createCanvas() {
        return new fabric.Canvas('design-surface', {
            backgroundColor: 'green',
            height: FieldDimensions.height,
            width: FieldDimensions.width
        });
    }

    drawField() {
        YardLinePainter.paint(this.canvas);
    }

    resize() {
        FieldResizer.resize(this.canvas);
    }

    addMarchers(members) {
        if (!members || members.length == 0)
            return;

        members.forEach(m => {
            var triangle = MarcherFactory.createMarcher(m);
            this.canvas.add(triangle);    
        });
            
    }

}


export default Field;