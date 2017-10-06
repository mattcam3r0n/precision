
class DesignKeyboardHandler {
    constructor(drillBuilder, drillPlayer) {
        this.drillBuilder = drillBuilder;
        this.drillPlayer = drillPlayer;
    }

    handlers = {
        "ArrowUp": (e) => {
            if (e.altKey) {
                console.log('arrow up, alt key.  add step N');
            }
        },

        "ArrowDown": (e) => {
            if (e.altKey) {
                console.log('arrow dn, alt key.  add step S');
            }
        },

        "ArrowLeft": (e) => {
            if (e.altKey) {
                console.log('arrow left, alt key.  add step W');
            }

            this.drillPlayer.stepBackward();
        },

        "ArrowRight": (e) => {
            if (e.altKey) {
                console.log('arrow right, alt key.  add step E');
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
