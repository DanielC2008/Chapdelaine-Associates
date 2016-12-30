"use strict"

  app.controller('Job', function($scope, $location, $http) {
    $scope.title = "Job"

    let URL = $location.$$url
    let sliceBegin = parseInt(URL.search(":")) + 1 
    let jobNumber = URL.slice(sliceBegin)

    $http.post('/getJob', {jobNumber})
      .success( job => {
        //everything job related gets set to the scope
        // console.log('job', job);
        $scope.title = `Job Number: ${job.job.jobNumber}`
      })
      .error( data => {
        alert('Wooops. There doesn\'t seem to be anything here!')
      })
  })