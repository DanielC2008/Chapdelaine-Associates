"use strict"

app.controller('ChooseJob', function($scope, $rootScope, MatchService, JobFactory) {

  $rootScope.lastURL = 'jobs'
  $scope.matches = MatchService.getMatches()
  $scope.jobsChecked = MatchService.getJobsChecked()
  $scope.othersChecked = MatchService.getOthersChecked()
  $scope.otherMatches = MatchService.otherMatches

  $scope.goToExact = (jobNumber, index) => {
    MatchService.setJobsChecked(index)
    JobFactory.goToJobPage(jobNumber)
  }

  $scope.goToOther = (jobNumber, index) => {
    MatchService.setOthersChecked(index)
    JobFactory.goToJobPage(jobNumber)
  }

  $scope.showOtherMatches = () => {
    $scope.otherMatches = true
    MatchService.otherMatches = true
  }
    
})