var weather = angular.module('weather', ['ngAnimate', 'pascalprecht.translate'])

.config(function ($translateProvider) {
	$translateProvider.translations('EN', {
		M_0: 'Jan',
		M_1: 'Feb',
		M_2: 'Mar',
		M_3: 'Apr',
		M_4: 'May',
		M_5: 'Jun',
		M_6: 'Jul',
		M_7: 'Aug',
		M_8: 'Sep',
		M_9: 'Oct',
		M_10: 'Nov',
		M_11: 'Dec',
		C_0: 'Moscow',
		C_1: 'Saint Petersburg',
		C_2: 'Nizhny Novgorod',
		C_3: 'Novosibirsk',
		C_4: 'Yekaterinburg',
		C_5: 'Kazan',
		SHOW: 'Show',
		CHOOSE_CITY: 'Choose city',
		CHOOSE_LNG: 'Choose language',
		LOADING_DATA: 'Loading data...',
		MORNING: 'Morning',
		DAY: 'Day',
		EVENING: 'Evening',
		NIGHT: 'Night',
	});
	$translateProvider.translations('RU', {
		M_0: 'Янв',
		M_1: 'Фев',
		M_2: 'Мар',
		M_3: 'Апр',
		M_4: 'Май',
		M_5: 'Июнь',
		M_6: 'Июлб',
		M_7: 'Авг',
		M_8: 'Сен',
		M_9: 'Окт',
		M_10: 'Ноя',
		M_11: 'Дек',
		C_0: 'Москва',
		C_1: 'Ст. Петербург',
		C_2: 'Нижний Новгород',
		C_3: 'Новосибирск',
		C_4: 'Екатеринбург',
		C_5: 'Казань',
		CHOOSE_CITY: 'Выберите город',
		CHOOSE_LNG: 'Выберите язык',
		SHOW: 'Показать',
		LOADING_DATA: 'Загрузка данных...',
		MORNING: 'Утро',
		DAY: 'День',
		EVENING: 'Вечер',
		NIGHT: 'Ночь'
	});
	$translateProvider.preferredLanguage('EN');
})

.factory('weatherFactory', function( $q, $http, $filter, $translate ){
	var weatherApiURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=";
	var weatherApiParam = "&units=metric&cnt=10&lang=";

	return {
		getNewForecast: function( city ){
			var deferred = $q.defer();
			var api_url = weatherApiURL + city.value + weatherApiParam + $translate.use();
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
			//var months = ['Янв','Фев','Мар','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Ноя','Дек'];
			var months = [$filter('translate')('M_0'),
										$filter('translate')('M_1'),
										$filter('translate')('M_2'),
										$filter('translate')('M_3'),
										$filter('translate')('M_4'),
										$filter('translate')('M_5'),
										$filter('translate')('M_6'),
										$filter('translate')('M_7'),
										$filter('translate')('M_8'),
										$filter('translate')('M_9'),
										$filter('translate')('M_10'),
										$filter('translate')('M_11')];
			var month = months[a.getMonth() - 1];
			var date = a.getDate();
			return date + ' ' + month;
		},
		getWeatherIcon: function( icon ) {
			return 'http://openweathermap.org/img/w/'+ icon +'.png'
		}
	}
})

.controller('mainCtrl', function($scope, $timeout, $filter, $translate, weatherFactory){

	$scope.menuOpen = '';
	$scope.menuToggle = function() {
		$scope.menuOpen = ! $scope.menuOpen ? 'st-menu-open' : '';
		if ( angular.isObject($scope.currentPopUpDay) ) $scope.closePopUp();
	};

	getCityList();

	$scope.selectedCity = $scope.cityList[0];
	$scope.cityTitle = $scope.selectedCity.name;

	$scope.forecast = [];

	weatherFactory.getNewForecast( $scope.selectedCity ).then(function( list ){
		createForecastList( list );
	});

	$scope.changeLanguage = function( lang ){
		$translate.use( lang );
		$scope.selectedCityValue = $scope.selectedCity.value;
		getCityList();
		$scope.cityList.forEach( refreshCityListTranslate );
	};

	$scope.activeLanguage = function( lang ) {
		return lang == $translate.use();
	};

	// City list wouldn't refresh authomaticly by changing $scope.cityList
	// because it depends on element fo the list and we changing name of the element, so it wouldn't be the same
	function refreshCityListTranslate(element, index, array) {
		if ( $scope.selectedCityValue == element.value ){
			$scope.selectedCity = element;
		}
	}

	function getCityList() {
		$scope.cityList = [
			{name: $filter('translate')('C_0'), value: 'Moscow'},
			{name: $filter('translate')('C_1'), value: 'Saint Petersburg'},
			{name: $filter('translate')('C_2'), value: 'Nizhny Novgorod'},
			{name: $filter('translate')('C_3'), value: 'Novosibirsk'},
			{name: $filter('translate')('C_4'), value: 'Yekaterinburg'},
			{name: $filter('translate')('C_5'), value: 'Kazan'}
		];
	}

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
						icon_url: weatherFactory.getWeatherIcon( list[index].weather[0].icon ),
						temp: list[index].temp
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
	};

	$scope.currentPopUpDay = null;

	$scope.openDayPopUp = function(day) {
		if ( angular.isObject($scope.currentPopUpDay) ) return false;

		$scope.currentPopUpDay = day;

		var selector = '.day-' + day.id;
		var dayItemElement = document.querySelector(selector);
		var thumbnailElement = dayItemElement.querySelector('.thumbnail');
		var popUpElement = document.querySelector( '#day-pop-up' );

		popUpElement.style.width = thumbnailElement.offsetWidth + 'px';
		popUpElement.style.height = thumbnailElement.offsetHeight + 'px';
		popUpElement.style.top = thumbnailElement.getBoundingClientRect().top + 'px';
		popUpElement.style.left = thumbnailElement.getBoundingClientRect().left + 'px';
		popUpElement.style.display = "block";

		$timeout(function(){
			angular.element( dayItemElement ).toggleClass( 'pop-up-open' );
			angular.element( popUpElement ).toggleClass( 'pop-up-open' );
			angular.element( document.querySelector( '#day-pop-up-bg' ) ).toggleClass( 'pop-up-open' );
			dayItemElement.style.visibility = "hidden";
		});

		$timeout(function(){
			popUpElement.querySelector('.content-wrap').style.opacity = 1;
		}, 300);
	};

	$scope.closePopUp = function() {
		var selector = '.day-' + $scope.currentPopUpDay.id;
		var dayItemElement = document.querySelector(selector);
		var popUpElement = document.querySelector( '#day-pop-up' );

		$scope.currentPopUpDay = null;
		popUpElement.querySelector('.content-wrap').style.opacity = 0;

		popUpElement.style.visibility = "visible";
		popUpElement.style.padding = "0";
		popUpElement.style.zIndex = "100";

		angular.element( dayItemElement ).toggleClass( 'pop-up-open' );
		angular.element( popUpElement ).toggleClass( 'pop-up-open' );

		$timeout(function(){
			dayItemElement.style.visibility = "visible";
			popUpElement.removeAttribute("style");
			angular.element( document.querySelector( '#day-pop-up-bg' ) ).toggleClass( 'pop-up-open' );
		}, 500);
	};

	$scope.addDayClass = function( index ) {
		return 'day-' + index;
	}

});
