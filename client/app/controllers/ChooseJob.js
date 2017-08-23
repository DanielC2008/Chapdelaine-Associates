"use strict"

app.controller('ChooseJob', function($scope, $rootScope, MatchService, JobFactory) {

  $rootScope.lastURL = 'jobs'
  $scope.Matches = MatchService.getMatches()
  $scope.jobsChecked = MatchService.getJobsChecked()

  $scope.goToJob = (jobNumber, index) => {
    MatchService.setJobsChecked(index)
    JobFactory.goToJobPage(jobNumber)
  }
    
})