"use strict"

  app.controller('ChooseJob', function($scope, FindJobService, JobFactory) {

    $scope.Matches = FindJobService.getMatches()
    console.log('$scope.Matches', $scope.Matches)

    $scope.getJob = jobNumber => JobFactory.goToJobPage(jobNumber)


  })