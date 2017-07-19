'use strict'

app.controller('JobForm', function($scope, ToastFactory, job) {

  if (job) {
    //updating current job
    $scope.currJob = job
  } else {
    //new job
    $scope.currJob = {
      jobInfo: {},
      prop: {},
      addresses : {},
      roads : {},
      client : {},
      clientType : {},
      clientRep : {},
      owner : {},
      ownerRep : {}
    }
  }
  //store updates seperately from current
  $scope.newJob = {
      jobInfo: {},
      prop: {},
      addresses : {},
      roads : {},
      client : {},
      clientType : {},
      clientRep : {},
      owner : {},
      ownerRep : {}
    }

  $scope.userSetJobNumber = () => $scope.newJobNumberRequired = true

  $scope.statusSet = status => {
    $scope.newJob.jobInfo = status
  }



})