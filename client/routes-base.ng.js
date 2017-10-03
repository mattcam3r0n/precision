'use strict';

angular.module('drillApp')

.config(function($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.deferIntercept();
}).run(['$rootScope', '$state', '$urlRouter', 'appStateService', function($rootScope, $state, $urlRouter, appStateService) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    switch(error) {
      case 'AUTH_REQUIRED':
      case 'FORBIDDEN':
      case 'UNAUTHORIZED':
        $state.go('main');
        break;
    }
  });
  appStateService.init().then(() => {
    $urlRouter.sync();
    $urlRouter.listen();  
  });
}]);