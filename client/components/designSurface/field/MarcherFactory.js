
class MarcherFactory {
    static createMarcher(member) {

        var triangle = new fabric.Triangle({
            // cosider center of object the origin. eg, rotate around center.
            originX: 'center',
            originY: 'center',
            width: 15,
            height: 15,
            fill: 'blue',
            left: member.initialState.x,
            top: member.initialState.y,
            angle: member.initialState.direction, // angle of object. correspond to direction.
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true
        });
        
        return triangle;
    }
}

export default MarcherFactory;