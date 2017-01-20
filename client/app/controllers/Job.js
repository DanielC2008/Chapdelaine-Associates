"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    $scope.showTab = 'JobMain'

    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)

    JobFactory.getJobFromDatabase(jobNumber)
      .success( Job => {
          $scope.Clients = Job.Clients
          $scope.Estimate = Job.Estimate
          $scope.Invoice = Job.Invoice
          $scope.Property = Job.Property
          $scope.Job = Job.Job[0]
        })
        .error( data => {
          alert('Wooops. There doesn\'t seem to be anything here!')
        })  
  })