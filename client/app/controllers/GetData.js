"use strict"

  app.controller('GetData', function($scope) {
    $scope.title = "GetData"
  })
  .controller('Logout', function($scope, $location, $rootScope) {
    $scope.logout = () => {
      $rootScope.$user = null
      $location.path('/login')
    }
    $scope.stayLoggedIn = () => {
      $location.path('/home')
    }
  })