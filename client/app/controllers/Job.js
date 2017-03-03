"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    let URL = $location.$$url
    $scope.jobNumber = URL.slice(parseInt(URL.search(":") + 1)) 
    $scope.showTab = 'JobMain'

    $scope.material = () => {
      $(document).ready(function() {  
        $('select').material_select();
      })  
    }

    //load data from database
    JobFactory.getJobFromDatabase($scope.jobNumber)
      .then( ({data}) => {
        if (data.Jobs[0]['Job Status'] === 'Pending') {
          data.Jobs[0]['Job Number'] = 'No Job Number'
        }
        $scope.Clients = data.Clients
        $scope.Estimates = data.Estimates[0]
        $scope.EstimateDetails = data.EstimateDetails
        $scope.Invoices = data.Invoices[0]
        $scope.InvoiceDetails = data.InvoiceDetails
        $scope.Property = data.Properties
        $scope.Representatives = data.Representatives
        $scope.Job = data.Jobs[0]
        $scope.jobId = $scope.Job.job_id
      })
      //can post status with .status and .statusText
      .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

  })