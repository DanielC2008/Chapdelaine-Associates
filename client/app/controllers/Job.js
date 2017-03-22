"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    let URL = $location.$$url
    $scope.jobNumber = URL.slice(parseInt(URL.search(":") + 1)) 

    $scope.setNewTab = newTab => {
      $scope.showTab = newTab
      JobFactory.setNewTab({jobNumber: $scope.jobNumber, showTab: newTab})
        .then()
        .catch(err => console.log('err', err))
     }

    $scope.material = () => {
      $(document).ready(function() {  
        $('select').material_select();
      })  
    }

    //load data from database
    JobFactory.getJobFromDatabase($scope.jobNumber)
      .then( ({data}) => {
        if (data.Jobs[0]['Job Status'] === 'Pending') {
          data.Jobs[0]['Job Number'] = 'No Job Number' //--------------------------------- fix this.. number > 0 in html
        }
        $scope.Clients = data.Clients
        $scope.Estimates = data.Estimates[0]
        $scope.EstimateDetails = data.EstimateDetails
        $scope.Invoices = data.Invoices[0]
        $scope.InvoiceDetails = data.InvoiceDetails
        $scope.Property = data.Properties
        $scope.Representatives = data.Representatives
        $scope.Attachments = data.Attachments
        $scope.Job = data.Jobs[0]
        $scope.jobId = $scope.Job.job_id

        JobFactory.setTab({jobNumber: $scope.jobNumber})
         .then( ({data}) => $scope.showTab = data.showTab)
         .catch( err => console.log('err', err))
      })
      //can post status with .status and .statusText
      .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

  })