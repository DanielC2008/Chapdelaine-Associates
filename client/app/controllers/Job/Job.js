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

  $scope.updateJob = () => {
    let locals = {
      job: $scope.job
    }
    locals.job.ids = {
      property_id: $scope.job.property.property_id,
      client_id: $scope.job.client.customer_id,
      client_contact_id: $scope.job.client_contact.customer_id ? $scope.job.client_contact.customer_id : null,
      owner_id: $scope.job.owner.customer_id ? $scope.job.owner.customer_id : null,
      owner_contact_id: $scope.job.owner_contact.customer_id ? $scope.job.owner_contact.customer_id : null
    }
    $mdDialog.show({
      locals,
      fullscreen: true,
      controller: 'JobForm',
      templateUrl: '/partials/jobForm.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    })
    .then().catch( err => console.log('err', err))
  }

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  JobFactory.getJobFromDatabase($scope.jobNumber)
  .then( ({data}) => {
    $scope.job = data
    console.log('$scope.job', $scope.job)
    // $scope.Estimates = data.Estimates
    // $scope.EstimateDetails = data.EstimateDetails
    // $scope.Invoices = data.Invoices
    // $scope.InvoiceDetails = data.InvoiceDetails
    // $scope.Attachments = data.Attachments
    // $scope.jobId = $scope.Job.job_id
    //redis saves previous tab accesses
    JobFactory.setTab({jobNumber: $scope.jobNumber}).then( ({data}) => $scope.showTab = data.showTab).catch( err => console.log('err', err))
    //last access update
    JobFactory.updateLastAccessed($scope.jobNumber).then().catch(err => console.log('err', err))
    $scope.material()
  })
  //can post status with .status and .statusText
  .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

})