import UndoManagerBase from 'undo-manager';

class UndoManager {
    constructor() {
        this.manager = new UndoManagerBase();
    }

    add(cmd) {
        this.manager.add(cmd);
    }

    clear() {
        this.manager.clear();
    }

    undo() {
        this.manager.undo();
    }

    redo() {
        this.manager.redo();
    }

    setLimit(limit) {
        this.manager.setLimit(limit);
    }

    getIndex() {
        return this.manager.getIndex();
    }

    getCommands() {
        return this.manager.getCommands();
    }

    getCurrentUndoCommand() {
        if (!this.manager.hasUndo()) return null;
        return this.manager.getCommands()[this.manager.getIndex()];
    }

    getCurrentRedoCommand() {
        if (!this.manager.hasRedo()) return;
        return this.manager.getCommands()[this.manager.getIndex() + 1];
    }

    hasUndo() {
        return this.manager.hasUndo();
    }

    getUndoLabel() {
        if (!this.manager.hasUndo()) return;
        return this.getCurrentUndoCommand().label;
    }

    hasRedo() {
        return this.manager.hasRedo();
    }

    getRedoLabel() {
        if (!this.manager.hasRedo()) return;
        return this.getCurrentRedoCommand().label;
    }
}

export default new UndoManager();
