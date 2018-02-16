'use strict';
import { Meteor } from 'meteor/meteor';

angular.module('drillApp')
.controller('AdminCtrl', function($scope) {
  $scope.viewName = 'Admin';
  $scope.selectedUser = Meteor.user();
});
