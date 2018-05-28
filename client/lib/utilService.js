class UtilService {
  constructor() {}

  blurActiveElement() {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
}

angular.module('drillApp').service('utilService', UtilService);
