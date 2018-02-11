import Events from '/client/lib/Events';
import Direction from '/client/lib/Direction';

class DesignKeyboardHandler {
    constructor(drillEditorService, eventService) {
        this.drillEditorService = drillEditorService;
        this.eventService = eventService;
    }

    get handlers() {
        return {
            'a': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.selectAll();
                    return;
                }
            },

            'd': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.deselectAll();
                    return;
                }
            },

            'Backspace': (e) => {
                if (e.altKey) {
                    this.drillEditorService.deleteBackspace();
                    return;
                }

                // re-broadcast delete key event
                this.eventService.notify(Events.deleteTurn);
            },

            'ArrowUp': (e) => {
                if (e.altKey) {
                    this.drillEditorService.addStep(Direction.N);
                    return;
                }
            },

            'ArrowDown': (e) => {
                if (e.altKey) {
                    this.drillEditorService.addStep(Direction.S);
                    return;
                }
            },

            'ArrowLeft': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.goToBeginning();
                    return;
                }

                if (e.altKey) {
                    this.drillEditorService.addStep(Direction.W);
                    return;
                }

                this.drillEditorService.stepBackward();
            },

            'ArrowRight': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.goToEnd();
                    return;
                }

                if (e.altKey) {
                    this.drillEditorService.addStep(Direction.E);
                    // TODO: detect shift for 1/2 step?
                    return;
                }

                this.drillEditorService.stepForward();
            },
        };
    };

    handle(e) {
        if (e.code == 'Space') return;
        // disregard if keystroke is not on body (or canvas)
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

        // allow dev tools shortcut, for convenience
        if (e.altKey && e.metaKey && e.key == 'Dead' && e.code == 'KeyI') return;

        // prevent shifting of document
        e.preventDefault();

        // ignore keys we don't have a handler for
        if (!this.handlers[e.key]) return;

        // call key handler
        this.handlers[e.key](e);
    }
}

export default DesignKeyboardHandler;
