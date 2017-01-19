"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    $scope.showTab = 'JobMain'

    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)

    JobFactory.getJobFromDatabase(jobNumber)
      .success( job => {
          //everything job related gets set to the scope
          $scope.title = `Job Number: ${job.jobNumber}`
        })
        .error( data => {
          alert('Wooops. There doesn\'t seem to be anything here!')
        })  
  })