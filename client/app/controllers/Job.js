"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    $scope.showTab = 'JobMain'
    $scope.edit = false
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

    $scope.makeChange = (client, key, value) => {
      client[key] = value
      console.log(client);
      console.log($scope.Clients);
      console.log($scope.edit)
      $scope.edit = false
      console.log($scope.edit);
      //find a way to close input box.. possibly sending something back to child
      // save to database////////////////////////////////////////////////
    }

    // $scope.editOrSave = () => {
    //   $scope.edit ? $scope.edit = false: $scope.edit = true
    //   //save to database//////////////////////////////////////////////
    // }
  })