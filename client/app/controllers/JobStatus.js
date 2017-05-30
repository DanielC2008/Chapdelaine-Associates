'use strict'

app.controller('JobStatus', function($scope, JobFactory, $mdDialog) {
  let JSscope = this

  JSscope.currJobStatus = $scope.jobInfo ? $scope.jobInfo.jobStatus : null //---if job already exists strore current status
  $scope.Job = {}

  const submitJobStatus = () => {
    if ($scope.currentStatus === 'New') {
      JobFactory.createNewJob($scope.Job)
        .then( ({data}) => { 
          JobFactory.toastSuccess(data.msg)
          $mdDialog.hide()
          JobFactory.goToJobPage($scope.Job.job_number)
        })
        .catch( ({data}) => JobFactory.toastReject(data.msg))
    } else {
      JobFactory.updateJobStatus({jobObj: $scope.Job, currJobNum: $scope.jobInfo.jobNumber})
        .then( ({data}) => { 
          JobFactory.toastSuccess(data.msg)
          $mdDialog.hide()
          JobFactory.goToJobPage($scope.Job.job_number)
        })
        .catch( ({data}) => JobFactory.toastReject(data.msg))
    }
  }

  JSscope.addJobStatus = status => {
    $scope.Job.job_status = status 
    if (status === 'Pending') {
      JobFactory.getMinJob()
        .then( ({data: {min}}) => { 
          if ( min < 0 ) { 
            $scope.Job.job_number = min - 1
          } else {
            $scope.Job.job_number = -1
          }
          submitJobStatus() 
        })
        .catch( ({data}) => console.log(data))
    }
  }

  $scope.numberSet = job_number => {
    if (job_number > 0) {
      $scope.Job.job_number = job_number
      submitJobStatus()
    } else {
      JobFactory.toastReject('Job number must be greater than 0!')
    }
  }


})






