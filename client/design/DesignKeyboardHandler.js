import Events from '/client/lib/Events';
import Direction from '/client/lib/Direction';

class DesignKeyboardHandler {
    constructor(drillEditorService, eventService) {
        this.drillEditorService = drillEditorService;
        this.eventService = eventService;
        this.reverseCounter = 0;
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

            'z': (e) => {
                console.log(e);
                if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
                    this.drillEditorService.undo();
                }

                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.drillEditorService.redo();
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

            'PageUp': (e) => {
                this.drillEditorService.addStep({ direction: Direction.N });
            },

            'PageDown': (e) => {
                this.drillEditorService.addStep({ direction: Direction.S });
            },

            'ArrowUp': (e) => {
                if (e.altKey) {
                    this.drillEditorService.addStep({ direction: Direction.N });
                    return;
                }
            },

            'ArrowDown': (e) => {
                if (e.altKey) {
                    this.drillEditorService.addStep({ direction: Direction.S });
                    return;
                }
            },

            'Shift': (e) => {
                console.log('resetting revere counter');
                this.reverseCounter = 0;
                this.reverseOriginCount = this.drillEditorService.currentCount;
            },

            'ArrowLeft': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.goToBeginning();
                    return;
                }

                if (e.shiftKey) {
                    console.log('origin', this.reverseOriginCount, 'counter', this.reverseCounter);

                    console.log(this.reverseOriginCount - this.reverseCounter, this.reverseOriginCount + this.reverseCounter);
                    this.drillEditorService
                        .reverseStep(this.reverseOriginCount - this.reverseCounter, // eslint-disable-line max-len
                            this.reverseOriginCount + this.reverseCounter);
                    this.reverseCounter++;
                    return;
                }

                if (e.altKey) {
                    this.drillEditorService.addStep({ direction: Direction.W });
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
                    this.drillEditorService.addStep({ direction: Direction.E });
                    // TODO: detect shift for 1/2 step?
                    return;
                }

                this.drillEditorService.stepForward();
            },

            '=': (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.drillEditorService.zoomIn();
                    return;
                }

                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.zoomToFit();
                }
            },

            // '+': (e) => {
            //     if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            //         console.log('+ zoom in');
            //         this.drillEditorService.zoomIn();
            //     }
            // },

            '-': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.zoomOut();
                }
            },

            'h': (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.drillEditorService.showAll();
                    return;
                }

                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.hideUnselected();
                }
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

        // console.log(e);

        // call key handler
        this.handlers[e.key](e);
    }
}

export default DesignKeyboardHandler;
