const requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

const cancelRequestAnimationFrame = window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame;

class AnimationLoop {
  constructor(callback) {
    this.callback = callback;
    this.isAnimating = false;
  }

  start() {
    let self = this;
    self.isAnimating = true;
    self.animationHandle = requestAnimationFrame(self.animate.bind(self));
  }

  animate(timestamp) {
    let self = this;
    self.callback(timestamp);
    if (self.isAnimating) {
      self.animationHandle = requestAnimationFrame(self.animate.bind(self));
    }
  }

  stop() {
    let self = this;
    self.isAnimating = false;
    cancelRequestAnimationFrame(self.animationHandle);
  }
}

export default AnimationLoop;
