var weather = angular.module('weather', [])

.controller('mainCtrl', function($scope, $http){
	
	$scope.menuOpen = '';

	$scope.menuToggle = function() {
		$scope.menuOpen = ! $scope.menuOpen ? 'st-menu-open' : '';
	}

	$scope.openWeatherPopUp = function () {
		$scope.weatherPopUpOpen = ! $scope.weatherPopUpOpen ? true : false;
	}


	//$http({method: 'GET', url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Moscow&units=metric&cnt=10&lang=ru'}).
	$http({method: 'GET', url: 'moscow.json'}).
		success(function(data, status, headers, config) {
			console.log( data );
			$scope.weatherObject = data;
			$scope.forecast = data.list;
		}).
		error(function(data, status, headers, config) {
			console.log( data );
			console.log( status );
		});

	$scope.convertDate = function(unix_stamp){
		var a = new Date(unix_stamp*1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var month = months[a.getMonth() - 1];
		var date = a.getDate();
		var time = date + ' ' + month;
		return time;
	}

	$scope.getWeatherIcon = function( icon ) {
		return 'http://openweathermap.org/img/w/'+ icon +'.png'
	}

})
