'use strict'

angular
	.module('Database', ['ngRoute'])
	.config( $routeProvider =>
		$routeProvider
			.when('/', {
				controller: 'Login-Register',
				templateUrl: 'partials/login-register.html'
			})
			.when('/home', {
				controller: 'Home',
				templateUrl: 'partials/home.html'
			})
			.when('/newJob', {
				controller: 'NewJob',
				templateUrl: 'partials/newJob.html'
			})
			.when('/findJob', {
				controller: 'FindJob',
				templateUrl: 'partials/findJob.html'
			})
			.when('/getData', {
				controller: 'GetData',
				templateUrl: 'partials/getData.html'
			})
	)
	.controller('Login-Register', function($scope, $http) {
		$scope.title = "Login-Register"
		$scope.login = () => {
			$http.post('/' , $scope.formData)
			.success(function(data) {
            console.log("posted successfully");
       		})
       		.error(function(data) {
            console.error("error in posting");
        	})
		}
	})
	.controller('Home', function($scope) {
		$scope.title = "Home"
	})
	.controller('NewJob', function($scope) {
		$scope.title = "NewJob"
	})
	.controller('FindJob', function($scope) {
		$scope.title = "FindJob"
	})
	.controller('GetData', function($scope) {
		$scope.title = "GetData"
	})
