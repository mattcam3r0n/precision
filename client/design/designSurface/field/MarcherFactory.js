import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Marcher from './Marcher';

class MarcherFactory {
    static createMarcher(initialState) {

        var strideType = initialState.strideType || StrideType.SixToFive;
        var fieldPoint = FieldDimensions.toFieldPoint({ x: initialState.x, y: initialState.y }, strideType);

        var marcher = new Marcher({
            width: FieldDimensions.marcherWidth,
            height: FieldDimensions.marcherHeight,
            left: fieldPoint.x,
            top: fieldPoint.y,
            angle: initialState.direction, // angle of object. correspond to direction.
        });
        
        return marcher;
    }
}

export default MarcherFactory;