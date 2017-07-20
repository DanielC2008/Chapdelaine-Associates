'use strict'

app.controller('JobForm', function($scope, ToastFactory, job) {

  if (job) {
    //updating current job
    $scope.hold = job.jobInfo.on_hold
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
  //STATUS CONTROLLER
  $scope.userSetJobNumber = () => $scope.newJobNumberRequired = true

  $scope.statusSet = status => {
    status.on_hold ? $scope.hold = true : $scope.hold = false
    Object.assign($scope.newJob.jobInfo, status)
    console.log('status', status)
  }

  $scope.showCause = cause => $scope.displayCause = cause 

  $scope.setTargetDate = (target) => {
    let MM = target.getMonth() + 1
    let DD = target.getDate()
    let YYYY = target.getFullYear()
    let targetDate = `${YYYY}-${MM}-${DD}`
    $scope.newJob.jobInfo.target_date = targetDate
    $scope.target = null
  }


})