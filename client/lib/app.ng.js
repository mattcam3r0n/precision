angular.module('drillApp', [
  'angular-meteor',
  'angular-meteor.auth',
  'ui.router',
  'ui.bootstrap',
  'angularUtils.directives.dirPagination',
  'accounts.ui'
]);

onReady = function() {

  var appInjector = angular.bootstrap(document, ['drillApp']);

//  var appState = appInjector.get('appStateService');
};
  
if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}