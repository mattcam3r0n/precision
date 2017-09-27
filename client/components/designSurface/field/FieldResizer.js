import FieldDimensions from '/client/lib/FieldDimensions';

class FieldResizer {

    static resize(canvas) {
        var size = this.getSize();
        // set css size to scale canvas to parent area
        canvas.setDimensions({ height: size.height + 'px', width: size.width + 'px' }, { cssOnly: true });
        canvas.renderAll();
    }
    
    static getSize() {
        // get the parent element that contains the canvas
        var parentEl = angular.element('.design-surface')[0];
        var size = {
            height: parentEl.clientWidth * .5,
            width: parentEl.clientWidth
        };
        return size;
    }

    static getZoomFactor() {
        var parentEl = angular.element('.design-surface')[0];
        return {
            x: parentEl.clientWidth / FieldDimensions.width,
            y: parentEl.clientWidth * .5 / FieldDimensions.height
        };     
    }
}

export default FieldResizer;