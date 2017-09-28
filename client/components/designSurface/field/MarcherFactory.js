import FieldDimensions from '/client/lib/FieldDimensions';

class MarcherFactory {
    static createMarcher(initialState) {

        var triangle = new fabric.Triangle({
            // cosider center of object the origin. eg, rotate around center.
            originX: 'center',
            originY: 'center',
            width: FieldDimensions.marcherWidth,
            height: FieldDimensions.marcherHeight,
            fill: 'red',
            stroke: 'black',
            left: initialState.x,
            top: initialState.y,
            angle: initialState.direction, // angle of object. correspond to direction.
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'pointer'
        });
        
        return triangle;
    }
}

export default MarcherFactory;