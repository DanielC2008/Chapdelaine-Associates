"use strict"

app.controller('ChooseJob', function($scope, $rootScope, MatchService, JobFactory) {

  $rootScope.lastURL = 'jobs'
  $scope.Matches = MatchService.getMatches()
  
  $scope.goToJob = jobNumber => JobFactory.goToJobPage(jobNumber)

})