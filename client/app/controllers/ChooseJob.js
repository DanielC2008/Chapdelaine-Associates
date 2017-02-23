"use strict"

  app.controller('ChooseJob', function($scope, FindJobService, JobFactory) {

    $scope.Matches = FindJobService.getMatches()
    
    $scope.getJob = jobNumber => JobFactory.goToJobPage(jobNumber)
  })