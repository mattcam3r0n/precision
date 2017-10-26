import StrideType from '/client/lib/StrideType';
import Direction from '/client/lib/Direction';
import StepType from '/client/lib/StepType';

class DesignKeyboardHandler {
    constructor(drillBuilder, drillPlayer, $rootScope) {
        this.drillBuilder = drillBuilder;
        this.drillPlayer = drillPlayer;
        this.rootScope = $rootScope
    }

    handlers = {
        "Backspace": (e) => {
            // broadcast delete key event?
            this.rootScope.$broadcast('design:backspacePressed');
        },

        "ArrowUp": (e) => {
            if (e.altKey) {
                this.drillBuilder.addStep(StrideType.SixToFive, StepType.Full, Direction.N);
                this.drillPlayer.stepForward();
                return;
            }
        },

        "ArrowDown": (e) => {
            if (e.altKey) {
                this.drillBuilder.addStep(StrideType.SixToFive, StepType.Full, Direction.S);
                this.drillPlayer.stepForward();
                return;
            }
        },

        "ArrowLeft": (e) => {
            if (e.altKey) {
                this.drillBuilder.addStep(StrideType.SixToFive, StepType.Full, Direction.W);
                this.drillPlayer.stepForward();
                return;
            }

            this.drillPlayer.stepBackward();
        },

        "ArrowRight": (e) => {
            if (e.altKey) {
                this.drillBuilder.addStep(StrideType.SixToFive, StepType.Full, Direction.E);
                this.drillPlayer.stepForward();
                return;
            }

            this.drillPlayer.stepForward();
        }
    };

    handle(e) {
        // disregard if keystroke is not on body (or canvas)
        if (e.target.tagName != 'BODY') return;

        // prevent shifting of document
        e.preventDefault();

        // ignore keys we don't have a handler for
        if (!this.handlers[e.key]) return;

        // call key handler
        this.handlers[e.key](e);
    }
}

export default DesignKeyboardHandler;
