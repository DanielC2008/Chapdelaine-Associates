'use strict'

app.controller('Logout', function($scope, $location, $rootScope, JobFactory) {
    $scope.logout = () => {
      JobFactory.removeUser()
        .then( data => {
          $rootScope.$user = null
          $location.path('/login')
        })
    }
    $scope.stayLoggedIn = () => {
      $location.path('/home')
    }
  })