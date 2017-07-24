'use strict'

app.controller('JobForm', function($scope, ToastFactory, job) {
  const defaultJob = {
    jobInfo: {
      job_status: 'New'
    },
    prop: {},
    addresses : {},
    roads : {},
    client : {},
    clientType : {},
    clientRep : {},
    owner : {},
    ownerRep : {}
  }
  $scope.job = job ? job : defaultJob
  const originalObj = Object.assign({}, $scope.job)

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