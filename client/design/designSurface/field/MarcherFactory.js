import StrideType from '/client/lib/StrideType';
import FieldDimensions from '/client/lib/FieldDimensions';
import Marcher from './Marcher';

class MarcherFactory {
    static createMarcher(initialState, options) {
        options = options || {};
        let strideType = initialState.strideType || StrideType.SixToFive;
        let fieldPoint = FieldDimensions.toFieldPoint({ x: initialState.x,
            y: initialState.y }, strideType);

        let marcher = new Marcher({
            width: FieldDimensions.marcherWidth,
            height: FieldDimensions.marcherHeight,
            left: fieldPoint.x,
            top: fieldPoint.y,
            angle: initialState.direction, // angle of object. correspond to direction.
            fill: options.fill || initialState.color || 'red',
        });

        return marcher;
    }
}

export default MarcherFactory;
