"use strict"

  app.controller('ChooseJob', function($scope, MatchService, JobFactory) {

    $scope.Matches = MatchService.getMatches()
    
    $scope.getJob = jobNumber => JobFactory.goToJobPage(jobNumber)
  })