'use strict'

app.controller('Logout', function($scope, $location, $rootScope, UserFactory) {
    $scope.logout = () => {
      UserFactory.removeUser()
        .then( data => {
          $rootScope.$user = null
          $location.path('/login')
        })
    }
    $scope.stayLoggedIn = () => {
      $location.path('/home')
    }
  })