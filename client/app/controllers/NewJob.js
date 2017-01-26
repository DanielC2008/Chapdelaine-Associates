'use strict'

app.controller('NewJob', function($scope, $http, JobFactory) {
      //Job or New Job
    //========goes to database and finds the last Job number used adds one
  JobFactory.getMaxJob()
    .success( data => {
      $scope.lastJob = parseInt(data['last']) 
    })
    .error( err => {
      console.log(err)
    })
    //========asks user if this this is the number they want to use
    $scope.createJob =  job_number => {
      JobFactory.createNewJob({job_number})
        .success( () => {

        })
        .error( err => console.log(err))
    }
    //===========maybe other settings about job as well?
    //========creates job in database then takes you to that jobs url
})