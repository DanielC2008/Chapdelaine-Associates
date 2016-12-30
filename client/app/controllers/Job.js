"use strict"

  app.controller('Job', function($scope, $location, $http) {
    $scope.title = "Job"

    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)

    $http.post('/getJob', {jobNumber})
      .success( job => {
        //everything job related gets set to the scope
        $scope.title = `Job Number: ${job.job.jobNumber}`
      })
      .error( data => {
        alert('Wooops. There doesn\'t seem to be anything here!')
      })
  })