import Action from './Action';

class Script {
    constructor(obj) {
        obj = obj || {};
        var defaultAction = new Action();
        this.initialState = obj.initialState || {
            x: 0,
            y: 0,
            strideType: defaultAction.strideType,
            stepType: defaultAction.stepType,
            direction: defaultAction.direction,
            deltaX: defaultAction.deltaX,
            deltaY: defaultAction.deltaY
        };
        this.currentState = obj.currentState || Object.assign({}, this.initialState);
        this.actions = obj.actions || [];
    }
}

export default Script;