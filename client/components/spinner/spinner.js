import { Spinner } from './spin.js';

const opts = {
  lines: 19, // The number of lines to draw
  length: 7, // The length of each line
  width: 16, // The line thickness
  radius: 58, // The radius of the inner circle
  scale: 1.1, // Scales overall size of the spinner
  corners: 0.5, // Corner roundness (0..1)
  color: '#66ccff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  opacity: 0.5, // Opacity of the lines
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  speed: 0.7, // Rounds per second
  trail: 33, // Afterglow percentage
  fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '51%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: 'none', // Box-shadow for the lines
  position: 'absolute', // Element positioning
};

class spinner {
  constructor(target) {
    this.target = target;
    this.spinner = new Spinner(opts);
  }

  spin() {
    this.spinner.spin(this.target);
  }

  start() {
    this.spinner.spin(this.target);
  }

  stop() {
    this.spinner.stop();
  }
}

export default spinner;
