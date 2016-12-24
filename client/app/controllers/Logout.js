'use strict'

app.controller('Logout', function($scope, $location, $rootScope) {
    $scope.logout = () => {
      $rootScope.$user = null
      $location.path('/login')
    }
    $scope.stayLoggedIn = () => {
      $location.path('/home')
    }
  })