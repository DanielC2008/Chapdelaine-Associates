'use strict'

app.controller('Home', function($scope, $http, $rootScope) {
    $http.get('/home')
    .success( data => {
      $scope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
  })