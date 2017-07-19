'use strict'

app.controller('JobForm', function($scope, ToastFactory) { 
  let JFscope = this
  $scope.tableForDB ='Jobs' //---for getMaxNumber on RN
 

  $scope.userSetJobNumber = () => $scope.newJobNumberRequired = true

  $scope.numberSet = number => { //for RecommendedNumber
    let job_number = Number(number)
    if (job_number != NaN && job_number > 0) {
      JFscope.Job.newJobInfo.job_number = job_number
      console.log('job_number', job_number)
      // submitJobStatus()
    } else {
      ToastFactory.toastReject('Job number must be a number greater than 0!')
    }
  }

  $scope.statusSet = status => {
    console.log('status', status)
  }



})