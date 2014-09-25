var weather = angular.module('weather', [])

.controller('mainCtrl', function($scope, $http){
	
	$scope.menuOpen = '';

	$scope.menuToggle = function() {
		$scope.menuOpen = ! $scope.menuOpen ? 'st-menu-open' : '';
	}

	$scope.openWeatherPopUp = function () {
		$scope.weatherPopUpOpen = ! $scope.weatherPopUpOpen ? true : false;
	}

/*
	$http({method: 'GET', url: 'http://api.openweathermap.org/data/2.5/forecast?q=moscow,ru&units=metric&lang=ru'}).
		success(function(data, status, headers, config) {
			console.log( data );
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		});
*/
})
