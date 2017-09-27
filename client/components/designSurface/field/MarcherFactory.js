
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
            cornerColor: 'black',
            borderColor: 'black',
            cornerStyle: 'circle',
            borderDashArray: [3, 3]
        });
        
        return triangle;
    }
}

export default MarcherFactory;