"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    $scope.showTab = 'JobMain'

    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)

    JobFactory.getJobFromDatabase(jobNumber)
      .success( Job => {
          console.log('Job', Job);
        })
        .error( data => {
          alert('Wooops. There doesn\'t seem to be anything here!')
        })  
  })