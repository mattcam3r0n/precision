'use strict';

angular.module('drillApp')
  .config(function($stateProvider, $urlRouterProvider) {
    // $urlMatcherFactoryProvider.strictMode(false);

    // to make urls without trailing / work
    // $urlRouterProvider.rule(function($injector, $location) {
    //   // let path = $location.url();
    //   // // check to see if the path already has a slash where it should be
    //   // if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
    //   //     return;
    //   // }
    //   // if (path.indexOf('?') > -1) {
    //   //     return path.replace('?', '/?');
    //   // }
    //   // return path + '/';

    //   let path = $location.path();
    //   let hasTrailingSlash = path[path.length-1] === '/';

    //   if (hasTrailingSlash) {
    //     // if last charcter is a slash, return the same url without the slash
    //     let newPath = path.substr(0, path.length - 1);
    //     return newPath;
    //   }
    // });

    $stateProvider
      .state('forgot-password', {
        url: '/forgot-password/:resetToken/',
        templateUrl: 'client/forgotPassword/forgotPassword.view.ng.html',
        controller: 'ForgotPasswordCtrl',
        params: {
          resetToken: {
            value: null,
            squash: true,
          },
        },
      });
  });
