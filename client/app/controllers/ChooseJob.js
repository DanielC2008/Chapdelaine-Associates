"use strict"

  app.controller('ChooseJob', function($scope, $rootScope, MatchService, JobFactory) {

    $rootScope.lastURL = 'jobs'
    $scope.getJob = jobNumber => JobFactory.goToJobPage(jobNumber)
    
    $scope.Matches = MatchService.getMatches()
  })