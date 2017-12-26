let requestAnimationFrame = window.requestAnimationFrame 
    || window.mozRequestAnimationFrame 
    || window.webkitRequestAnimationFrame 
    || window.msRequestAnimationFrame;

let cancelRequestAnimationFrame = window.cancelAnimationFrame 
    || window.webkitCancelRequestAnimationFrame 
    || window.mozCancelRequestAnimationFrame 
    || window.oCancelRequestAnimationFrame 
    || window.msCancelRequestAnimationFrame;

class AnimationLoop {
    constructor(callback) {
        this.callback = callback;
    }

    start() {
        this.animationHandle = requestAnimationFrame(this.animate.bind(this));
    }

    animate(timestamp) {
        this.callback(timestamp);
        this.animationHandle = requestAnimationFrame(this.animate.bind(this));
    }

    stop() {
        cancelRequestAnimationFrame(this.animationHandle);
    }
}

export default AnimationLoop;
