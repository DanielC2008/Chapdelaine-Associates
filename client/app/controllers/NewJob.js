'use strict'

app.controller('NewJob', function($scope, $http, JobFactory) {
  $scope.newJob = {}

  $scope.addJobStatus = status => {
    $scope.newJob.job_status = status 
    if (status === 'Pending') {
      JobFactory.getMinJob()
        .success( ({min}) => { 
          if ( min < 0 ) { 
            $scope.newJob.job_number = min - 1
          } else {
            $scope.newJob.job_number = -1
          }
          createNewJob() 
        })
        .error( err => console.log(err))
    }
  }


  //goes to database and finds the last Job number used adds one
  JobFactory.getMaxJob()
    .success( ({max}) => {
      $scope.recommended = max + 1 
    })
    .error( err => console.log(err))

  $scope.addJobNumber = job_number => {
    $scope.newJob.job_number = job_number
    createNewJob()
  }

  const createNewJob = () => {
    JobFactory.createNewJob($scope.newJob)
      .success( ({edit}) => {
        JobFactory.goToEditAllJobPage($scope.newJob.job_number)
      })
      .error( err => console.log(err))
  }
})