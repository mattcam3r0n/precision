import Logger from '/client/lib/Logger';

const app = angular.module('drillApp', [
  'angular-meteor',
  'angular-meteor.auth',
  'ui.router',
  'ui.bootstrap',
  'angularUtils.directives.dirPagination',
  'accounts.ui',
]);

app.config(($provide) => {
  $provide.decorator('$exceptionHandler', ($delegate) => {
    return (exception, cause) => {
        $delegate(exception, cause);
        Logger.logException(exception);
    };
  });
});

app.run(function($rootScope, $templateCache) {
    $rootScope.$safeApply = function(fn) {
      if (!this.$root) return;
      let phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
});

onReady = function() {
  let appInjector = angular.bootstrap(document, ['drillApp']);
  window.addEventListener('error', onError);
};

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}

function onError(e) {
  Logger.info('Uncaught error', {
    message: e.message,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error.stack,
    isTrusted: e.isTrusted,
    filename: e.filename,
  });
}
