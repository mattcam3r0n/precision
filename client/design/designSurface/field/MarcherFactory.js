import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';

class MarcherFactory {
    static createMarcher(initialState) {

        var strideType = initialState.strideType || StrideType.SixToFive;
        var fieldPoint = FieldDimensions.toFieldPoint({ x: initialState.x, y: initialState.y }, strideType);

        var triangle = new fabric.Triangle({
            // cosider center of object the origin. eg, rotate around center.
            originX: 'center',
            originY: 'center',
            width: FieldDimensions.marcherWidth,
            height: FieldDimensions.marcherHeight,
            fill: 'red',
            stroke: 'black',
            left: fieldPoint.x,
            top: fieldPoint.y,
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