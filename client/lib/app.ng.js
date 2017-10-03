angular.module('drillApp', [
  'angular-meteor',
  'angular-meteor.auth',
  'ui.router',
  'ui.bootstrap',
  'angularUtils.directives.dirPagination',
  'accounts.ui'
])
.run(function($rootScope, $templateCache) {
  
    $rootScope.$safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
      
});

onReady = function() {

  var appInjector = angular.bootstrap(document, ['drillApp']);

//  var appState = appInjector.get('appStateService');
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}