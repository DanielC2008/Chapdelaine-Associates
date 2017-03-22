'use strict'


const app = angular.module('Database', ['ngRoute', 'focus-if', 'ngMaterial', 'ngMessages', 'angularFileUpload'])
  .run(function($rootScope, JobFactory) {
    JobFactory.getUserName()
      .then(({data}) => $rootScope.$user = data.user_name)
  })
	.config( $routeProvider =>
		$routeProvider
      .when('/login', {
        controller: 'Login-Register',
        templateUrl: 'partials/login-register.html'
      })
			.when('/logout', {
				controller: 'Logout',
        templateUrl: 'partials/logout.html'
			})
			.when('/home', {
				controller: 'Home',
				templateUrl: 'partials/home.html'
			})
			.when('/newJob', {
				controller: 'NewJob',
				templateUrl: 'partials/newJob.html'
			})
      .when('/getData', {
        controller: 'GetData',
        templateUrl: 'partials/getData.html'
      })
      .when('/jobs', {
        controller: 'ChooseJob',
        templateUrl: 'partials/chooseJob.html'
      })
      .when('/jobs/:job_id', {
        controller: 'Job',
        templateUrl: 'partials/job.html'
      })
			.otherwise('/login')
	)
	
	

