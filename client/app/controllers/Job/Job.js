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

  // const resetSelect = () => {
  //   $scope.select = ''
  //   $scope.material()
  //  }

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  JobFactory.getJobFromDatabase($scope.jobNumber)
  .then( ({data}) => {

    //maybe change this to jobForm format

    $scope.jobInfo = data.job_Info
    $scope.property = data.property
    $scope.client = data.client
    $scope.clientContact = data.client_contact
    $scope.owner = data.owner
    // $scope.Addresses = data.Addresses
    // $scope.Roads = data.Roads
    $scope.ownerContact = data.owner_contact
    // $scope.Estimates = data.Estimates
    // $scope.EstimateDetails = data.EstimateDetails
    // $scope.Invoices = data.Invoices
    // $scope.InvoiceDetails = data.InvoiceDetails
    // $scope.Attachments = data.Attachments
    // $scope.jobId = $scope.Job.job_id
    //redis saves previous tab accesses
    JobFactory.setTab({jobNumber: $scope.jobNumber})
    .then( ({data}) => $scope.showTab = data.showTab)
    .catch( err => console.log('err', err))
    //last access update
    JobFactory.updateLastAccessed($scope.jobNumber)
    .then()
    .catch(err => console.log('err', err))
    $scope.material()
  })
  //can post status with .status and .statusText
  .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

})