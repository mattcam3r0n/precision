
/**
 * StepType
 */
class StepType {
    /** A full step */
    static get Full() {
        return 0;
    }

    /** A half step */
    static get Half() {
        return 1;
    }

    /** Mark time in place */
    static get MarkTime() {
        return 2;
    }

    /** Halted */
    static get Halt() {
        return 3;
    }

    /** A gate/pinwheel step */
    static get Pinwheel() {
        return 4;
    }

    // No change in direction or position
    static get DeadStep() {
        return 5;
    }

    // change in direction but not position
    static get FaceStep() {
        return 6;
    }

    static get DragStep() {
        return 7;
    }
};

export default StepType;
