'use strict'


const app = angular.module('Database', ['ngRoute', 'ngAria', 'focus-if', 'ngMaterial', 'ngMessages', 'angularFileUpload', 'dndLists'])
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
      .when('/jobs', {
        controller: 'ChooseJob',
        templateUrl: 'partials/chooseJob.html'
      })
      .when('/jobs/:job_id', {
        controller: 'Job',
        templateUrl: 'partials/job/job.html'
      })
      .when('/admin', {
        controller: 'Admin',
        templateUrl: 'partials/admin/admin.html'
      })
      .otherwise('/login')
  )
  .config(function($mdAriaProvider) {
    // Globally disables all ARIA warnings.
    $mdAriaProvider.disableWarnings() 
  })
  .run( function($rootScope, $location, UserFactory) {
    $rootScope.timeZoneOffset = `+${new Date().getTimezoneOffset()}`
    UserFactory.getUserName()
      .then(({data}) => $rootScope.$user = data.user_name)
    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( $rootScope.$user === null ) {
        //already going to #login, no redirect needed
        if ( next.templateUrl == "partials/login-register.html" ) { 
        // not going to login-register, redirect now
        } else {  
          $location.path( "/login" )
          alert('Please Log In.')
        }
      }         
    })
  })
  
  

