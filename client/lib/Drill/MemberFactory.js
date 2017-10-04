import { Random } from 'meteor/random';

class MemberFactory {
    static createMember(strideType, dir, point) {
        var newMember = {};
        newMember.id = Random.id();
        newMember.initialState = {
            x: point.x,
            y: point.y,
            direction: dir,
            strideType: strideType
        };
		newMember.currentState = {
			x: point.x,
			y: point.y,
            direction: dir,
            strideType: strideType,
			count: 0
        };
        newMember.script = [];
        
        return newMember;
    }
}

export default MemberFactory;