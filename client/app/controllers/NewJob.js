'use strict'

app.controller('NewJob', function($scope, $http, JobFactory) {
  JobFactory.getMaxJob()
    .success( data => console.log(data))
    .error( err => console.log(err))
  $scope.title = "NewJob"
})