"use strict"

app.controller('Job', function($scope, $rootScope, $location, JobFactory, $mdDialog, $route) {

  let URL = $location.$$url
  const lastURL = $rootScope.lastURL ? $rootScope.lastURL : 'home'
  $scope.jobNumber = URL.slice(parseInt(URL.search(":") + 1))

  $scope.setNewTab = newTab => {
    $scope.showTab = newTab
    JobFactory.setNewTab({jobNumber: $scope.jobNumber, showTab: newTab}).then().catch(err => console.log('err', err))
   }

  $scope.exitJob = () => $location.path(`/${lastURL}`)

  $scope.updateJob = () => {
    const locals = {
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
      clickOutsideToClose: false,
      multiple: true
    })
    .then( jobNumber => {
      //job number was not changed but other data was changed
      if (jobNumber === $scope.jobNumber) {
       $route.reload()
       //job number was changed go to new page
      } else if (typeof jobNumber === 'number')  {
        JobFactory.goToJobPage(jobNumber)
      }
    }).catch( err => console.log('err', err))
  }

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  JobFactory.getJobFromDatabase($scope.jobNumber)
  .then( ({data}) => {
    $scope.job = data
    //redis saves previous tab accesses
    JobFactory.setTab({jobNumber: $scope.jobNumber}).then( ({data}) => $scope.showTab = data.showTab).catch( err => console.log('err', err))
    //last access update
    JobFactory.updateLastAccessed({job_number: $scope.jobNumber, date: new Date()}).then().catch(err => console.log('err', err))
    $scope.material()
  })
  //can post status with .status and .statusText
  .catch( () => alert('Wooops. There doesn\'t seem to be anything here!'))

})