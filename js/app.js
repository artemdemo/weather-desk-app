var weather = angular.module('weather', [])

.controller('mainCtrl', function($scope){
	
	$scope.menuOpen = '';

	$scope.menuToggle = function() {

		$scope.menuOpen = ! $scope.menuOpen ? 'st-menu-open' : '';

	}

})
