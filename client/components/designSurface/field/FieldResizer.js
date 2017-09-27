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
}

export default FieldResizer;