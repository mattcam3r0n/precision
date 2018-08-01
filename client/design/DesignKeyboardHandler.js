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
            ' ': (e) => {
                if (this.drillEditorService.isPlaying()) {
                    this.drillEditorService.stop();
                } else {
                    this.drillEditorService.play();
                }
            },

            'a': (e) => {
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.selectAll();
                    return;
                }
            },

            'd': (e) => {
                // shortcut to log drill object
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    console.log('drill', this.drillEditorService.drill);
                }
                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.deselectAll();
                    return;
                }
            },

            'z': (e) => {
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

                if (e.ctrlKey || e.metaKey) {
                    this.drillEditorService.deleteForward();
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

            'Up': (e) => {
                this.upArrow(e);
            },

            'Down': (e) => {
                this.downArrow(e);
            },

            'ArrowUp': (e) => {
                this.upArrow(e);
            },

            'ArrowDown': (e) => {
                this.downArrow(e);
            },

            'Shift': (e) => {
                this.reverseCounter = 0;
                this.reverseOriginCount = this.drillEditorService.currentCount;
            },

            'Left': (e) => {
                this.leftArrow(e);
            },

            'Right': (e) => {
                this.rightArrow(e);
            },

            'ArrowLeft': (e) => {
                this.leftArrow(e);
            },

            'ArrowRight': (e) => {
                this.rightArrow(e);
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

            'H': (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    this.drillEditorService.showAll();
                    return;
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
//        console.log(e);
//        if (e.code == 'Space') return;
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

    rightArrow(e) {
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
    }

    leftArrow(e) {
        if (e.ctrlKey || e.metaKey) {
            this.drillEditorService.goToBeginning();
            return;
        }

        if (e.shiftKey) {
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
    }

    upArrow(e) {
        if (e.altKey) {
            this.drillEditorService.addStep({ direction: Direction.N });
            return;
        }
    }

    downArrow(e) {
        if (e.altKey) {
            this.drillEditorService.addStep({ direction: Direction.S });
            return;
        }
    }
}

export default DesignKeyboardHandler;
