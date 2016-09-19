angular.module('toolbarDemo1', ['ngMaterial'])
.config(function($mdThemingProvider) {
	// https://www.materialpalette.com
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('grey');
})
.controller('AppCtrl', function($scope, $timeout, $mdSidenav) {
	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    };
});