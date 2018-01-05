import FieldDimensions from '/client/lib/FieldDimensions';

class FieldResizer {

    static sizeToFit(canvas) {
        // set container size based on position of footer
        $('.design-surface-container').height($('div.footer').position().top - 50);
        var size = this.getParentSize();
        this.setSize(canvas, size);
    }

    static zoomIn(canvas) {
        var size = this.getCanvasSize();
        console.log('before zoomin', size);
        size.height = size.height * 1.1;
        size.width = size.width * 1.1;
        console.log('before zoomin', size);
        this.setSize(canvas, size);
    }

    static zoomOut(canvas) {
        var size = this.getCanvasSize();
    console.log('before zoomout', size);
        size.height = size.height * .9;
        size.width = size.width * .9;
    console.log('after zoomout', size);
        this.setSize(canvas, size);
    }

    static resize(canvas) {
        this.sizeToFit(canvas);
    }

    static setSize(canvas, size) {
        // set css size to scale canvas to parent area
        canvas.setDimensions({ height: size.height + 'px', width: size.width + 'px' }, { cssOnly: true });
        canvas.renderAll();
    }
    
    static getParentSize() {
        // get the parent element that contains the canvas
        var parentEl = angular.element('.design-surface')[0];
        var size = {
            // height: parentEl.clientWidth * .5,
            // width: parentEl.clientWidth
            height: parentEl.clientHeight,
            width: parentEl.clientHeight * 2
        };
        return size;
    }
    
    static getCanvasSize() {
        // get the parent element that contains the canvas
        //var parentEl = angular.element('.design-surface')[0];
        var canvasEl = $('canvas#design-surface')[0];
        var size = {
            // height: parentEl.clientWidth * .5,
            // width: parentEl.clientWidth
            height: canvasEl.clientHeight,
            width: canvasEl.clientHeight * 2
        };
        return size;
    }

    static getZoomFactor() {
        //var parentEl = angular.element('.design-surface')[0];
        var canvasEl = angular.element('canvas#design-surface')[0];
        return {
            // x: parentEl.clientWidth / FieldDimensions.width,
            // y: parentEl.clientWidth * .5 / FieldDimensions.height            
            x: canvasEl.clientHeight * 2 / FieldDimensions.width,
            y: canvasEl.clientHeight / FieldDimensions.height            
        };     
    }
}

export default FieldResizer;