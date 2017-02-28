'use strict'

app.controller('NewJob', function($scope, $http, JobFactory) {
  $scope.newJob = {}

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


  //goes to database and finds the last Job number used adds one
  JobFactory.getMaxNumber({table:'Jobs'})
    .then( ({data: {max}}) => {
      $scope.recommended = max + 1 
    })
    .catch( ({data}) => console.log(data))

  $scope.addJobNumber = job_number => {
    $scope.newJob.job_number = job_number
    createNewJob()
  }

  const createNewJob = () => {
    JobFactory.createNewJob($scope.newJob)
      .then( () => JobFactory.goToJobPage($scope.newJob.job_number))
      .catch( ({data}) => console.log(data))
  }


})






