var weather = angular.module('weather', ['ngAnimate'])

.factory('weatherFactory', function( $q, $http ){
	var weatherApiURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=";
	var weatherApiParam = "&units=metric&cnt=10&lang=ru";

	return {
		getNewForecast: function( city ){
			var deferred = $q.defer();
			var api_url = weatherApiURL + city.value + weatherApiParam;
			$http({method: 'GET', url: api_url}).
			//$http({method: 'GET', url: 'moscow.json'}).
				success(function(data, status, headers, config) {
					deferred.resolve( data.list );
				}).
				error(function(data, status, headers, config) {
					deferred.reject( 'Error in $http request' );
					console.log( data );
					console.log( status );
				});
			return deferred.promise;
		},
		convertDate: function(unix_stamp){
			var a = new Date(unix_stamp*1000);
			//var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var months = ['Янв','Фев','Мар','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Ноя','Дек'];
			var month = months[a.getMonth() - 1];
			var date = a.getDate();
			var time = date + ' ' + month;
			return time;
		},
		getWeatherIcon: function( icon ) {
			return 'http://openweathermap.org/img/w/'+ icon +'.png'
		}
	}
})

.controller('mainCtrl', function($scope, $timeout, weatherFactory){
	
	$scope.menuOpen = '';
	$scope.menuToggle = function() {
		$scope.menuOpen = ! $scope.menuOpen ? 'st-menu-open' : '';
	}

	$scope.cityList = [
		{name: 'Москва', value: 'Moscow'},
		{name: 'Ст. Петербург', value: 'Saint Petersburg'},
		{name: 'Нижний Новгород', value: 'Nizhny Novgorod'},
		{name: 'Новосибирск', value: 'Novosibirsk'},
		{name: 'Екатеринбург', value: 'Yekaterinburg'},
		{name: 'Казань', value: 'Kazan'}
	];

	$scope.selectedCity = $scope.cityList[0];
	$scope.cityTitle = $scope.selectedCity.name;

	$scope.forecast = [];

	weatherFactory.getNewForecast( $scope.selectedCity ).then(function( list ){
		createForecastList( list );
	});

	function createForecastList( list ) {
		for ( var i = 0; i < list.length; i++ ) {
			(function(index){
				var timer = 200 * index;
				$timeout(function(){
					$scope.forecast.push({
						id: index,
						date: weatherFactory.convertDate( list[index].dt ),
						temp_min: list[index].temp.min.toFixed(0),
						temp_max: list[index].temp.max.toFixed(0),
						description: list[index].weather[0].description,
						icon_url: weatherFactory.getWeatherIcon( list[index].weather[0].icon )
					});
				}, timer);
			})(i);
		}
	}

	$scope.showForecast = function() {
		$scope.forecast = [];
		$scope.menuToggle();
		$scope.cityTitle = $scope.selectedCity.name;
		weatherFactory.getNewForecast( $scope.selectedCity ).then(function( list ){
			createForecastList( list );
		})
	}

	$scope.openDayPopUp = function(day) {
		console.log( day );
		var selector = '.day-' + day.id;
		var dayItemElement = document.querySelector(selector);
		var thumbnailElement = dayItemElement.querySelector('.thumbnail');
		var popUpElement = document.querySelector( '#day-pop-up' );

		popUpElement.style.width = thumbnailElement.offsetWidth + 'px';
		popUpElement.style.height = thumbnailElement.offsetHeight + 'px';
		popUpElement.style.top = thumbnailElement.getBoundingClientRect().top + 'px';
		popUpElement.style.left = thumbnailElement.getBoundingClientRect().left + 'px';

		$timeout(function(){
			angular.element( dayItemElement ).toggleClass( 'pop-up-open' );
			angular.element( popUpElement ).toggleClass( 'pop-up-open' );
			angular.element( document.querySelector( '#day-pop-up-bg' ) ).toggleClass( 'pop-up-open' );
		});
	}

	$scope.closePopUp = function() {
		
	}

	$scope.addDayClass = function( index ) {
		return 'day-' + index;
	}

})
