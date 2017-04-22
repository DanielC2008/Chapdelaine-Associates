'use strict'

app.controller('NewJob', function($scope, $http, JobFactory) {
  $scope.newJob = {}
  $scope.tableForDB = 'Jobs'
  $scope.addJobStatus = status => {
    $scope.newJob.job_status = status 
    if (status === 'Pending') {
      JobFactory.getMinJob()
        .then( ({data: {min}}) => { 
          if ( min < 0 ) { 
            $scope.newJob.job_number = min - 1
          } else {
            $scope.newJob.job_number = -1
          }
          createNewJob() 
        })
        .catch( ({data}) => console.log(data))
    }
  }

  $scope.numberSet = job_number => {
    if (job_number > 0) {
      $scope.newJob.job_number = job_number
      createNewJob()
    } else {
      JobFactory.toastReject('Job number must be greater than 0!')
    }
  }

  const createNewJob = () => {
    JobFactory.createNewJob($scope.newJob)
      .then( ({data}) =>  data.msg ? JobFactory.toastReject(data.msg) : JobFactory.goToJobPage($scope.newJob.job_number))
      .catch( ({data}) => console.log(data))
  }


})






