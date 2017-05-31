"use strict"

app.controller('Job', function($scope, $location, JobFactory, $mdDialog) {
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
      $('select').material_select()
    })  
  }

  JobFactory.getJobFromDatabase($scope.jobNumber)
    .then( ({data}) => {

      $scope.Clients = data.Clients
      $scope.Estimates = data.Estimates
      $scope.EstimateDetails = data.EstimateDetails
      $scope.Invoices = data.Invoices
      $scope.InvoiceDetails = data.InvoiceDetails
      $scope.Property = data.Properties
      $scope.Representatives = data.Representatives
      $scope.Attachments = data.Attachments
      $scope.Job = data.Jobs
      $scope.jobId = $scope.Job.job_id

      //redis saves previous tab accesses
      JobFactory.setTab({jobNumber: $scope.jobNumber})
       .then( ({data}) => $scope.showTab = data.showTab)
       .catch( err => console.log('err', err))
      //last access update
      JobFactory.updateLastAccessed($scope.jobNumber)
        .then()
        .catch(err => console.log('err', err))
    })
    //can post status with .status and .statusText
    .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

  $scope.updateStatus = () => {
    let locals = {
      jobInfo: { 
        tableForDB: 'Jobs',
        jobStatus: $scope.Job['Job Status'],
        jobNumber: $scope.Job['Job Number']
      }
    }  

    $mdDialog.show({
      locals,
      controller: 'UpdateStatus as US',
      templateUrl: '/partials/updateStatus.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    })
  }

})