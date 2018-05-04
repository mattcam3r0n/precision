import Spinner from '/client/components/spinner/spinner';

class spinnerService {
  constructor() {}

  init(el) {
    el = el || 'div.design';
    this.spinner = new Spinner($(el)[0]);
  }

  spin() {
    this.spinner.start();
  }

  start() {
    this.spinner.start();
  }

  stop() {
    this.spinner.stop();
  }

  show() {
    this.spinner.start();
  }

  hide() {
    this.spinner.stop();
  }
}

angular
  .module('drillApp')
  .service('spinnerService', ['appStateService', spinnerService]);
