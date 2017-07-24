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

  $scope.showCause = cause => $scope.displayCause = cause 

  $scope.setDate = (date, type) => {
    let MM = date.getMonth() + 1
    let DD = date.getDate()
    let YYYY = date.getFullYear()
    let formatedDate = `${YYYY}-${MM}-${DD}`
    $scope.job.jobInfo[`${type}_date`] = formatedDate
    $scope[`${type}Date`] = null
  }


})