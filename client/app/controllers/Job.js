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

  JobFactory.getJobFromDatabase($scope.jobNumber)
    .then( ({data}) => {
      JobFactory.updateLastAccessed($scope.jobNumber)
        .then()
        .catch(err => console.log('err', err))
     //could use a refactor
      data.Jobs[0]['Date Started'] = data.Jobs[0]['Date Started'] === null ? '' : formatDate(new Date(data.Jobs[0]['Date Started']))
      data.Jobs[0]['Date Completed'] = data.Jobs[0]['Date Completed'] === null ? '' : formatDate(new Date(data.Jobs[0]['Date Completed']))
      data.Jobs[0]['Last Accessed'] = data.Jobs[0]['Last Accessed'] === null ? '' : formatDateTime(new Date(data.Jobs[0]['Last Accessed']))

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
      //redis saves previous tab accesses
      JobFactory.setTab({jobNumber: $scope.jobNumber})
       .then( ({data}) => $scope.showTab = data.showTab)
       .catch( err => console.log('err', err))
    })
    //can post status with .status and .statusText
    .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

  const formatDate = date => `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
  const formatDateTime = dateTime => `${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString()}`

})