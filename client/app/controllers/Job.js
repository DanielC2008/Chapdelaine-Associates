"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    let URL = $location.$$url
    $scope.jobNumber = $scope.editAll === true ? URL.slice(parseInt(URL.search(":") + 1), URL.lastIndexOf('/')) : URL.slice(parseInt(URL.search(":") + 1)) 
    $scope.showTab = 'JobMain'

    //load data from database
    JobFactory.getJobFromDatabase($scope.jobNumber)
      .then( ({data}) => {
        if (data.Jobs[0]['Job Status'] === 'Pending') {
          data.Jobs[0]['Job Number'] = 'No Job Number'
        }
        $scope.Clients = data.Clients
        $scope.Estimate = data.Estimates
        $scope.Invoice = data.Invoices
        $scope.Property = data.Properties
        $scope.Representatives = data.Representatives
        $scope.Job = data.Jobs[0]
      })
      //can post status with .status and .statusText
      .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

  })