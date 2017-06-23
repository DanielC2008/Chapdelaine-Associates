"use strict"

app.controller('Job', function($scope, $location, JobFactory, $mdDialog, $rootScope, $route, ClientFactory, RepFactory) {
  let URL = $location.$$url
  $scope.jobNumber = URL.slice(parseInt(URL.search(":") + 1))

  $scope.setNewTab = newTab => {
    $scope.showTab = newTab
    JobFactory.setNewTab({jobNumber: $scope.jobNumber, showTab: newTab})
    .then()
    .catch(err => console.log('err', err))
   }

  const resetSelect = () => {
    $scope.select = ''
    $scope.material()
   }

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  JobFactory.getJobFromDatabase($scope.jobNumber)
    .then( ({data}) => {

      let owner = data.Clients.filter( client => client.client_type === 'Owner')
      $scope.Owner = owner[0]
      $scope.Main = data.Main
      $scope.Clients = data.Clients
      $scope.Estimates = data.Estimates
      $scope.EstimateDetails = data.EstimateDetails
      $scope.Invoices = data.Invoices
      $scope.InvoiceDetails = data.InvoiceDetails
      $scope.Property = data.Property
      $scope.Representatives = data.Representatives
      $scope.Attachments = data.Attachments
      $scope.Job = data.Job
      $scope.Addresses = data.Addresses
      $scope.Roads = data.Roads
      $scope.jobId = $scope.Job.job_id
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

  const updateStatus = () => { 
    let locals = {
      jobInfo: { 
        tableForDB: 'Jobs',
        jobStatus: $scope.Job.job_status,
        jobNumber: $scope.Job.job_number
      }
    }  
    $mdDialog.show({
      locals,
      controller: 'UpdateStatus as US',
      templateUrl: '/partials/updateStatus.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    })
    .then( () => {})
    .catch( () => {})
  }

  $scope.update = change => {
    if (change === 'updateStatus') {
      updateStatus()
    }

    else if (change === 'addClient') {
      let ids = { job_id: $scope.jobId}
      ClientFactory.addClient(ids)
      .then( ({msg}) => {
        $route.reload()
        JobFactory.toastSuccess(msg)
      })  
      .catch( err => err.msg ? JobFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editClient') { 
      let ids = { job_id: $scope.jobId}
      ClientFactory.editClient(ids, $scope.Clients)
      .then( ({msg}) => {
        $route.reload()
        JobFactory.toastSuccess(msg)
      })  
      .catch( err => err.msg ? JobFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'addRep') {
      let ids = { job_id: $scope.jobId}
      RepFactory.addRep(ids, $scope.Clients)
      .then( ({msg}) => {
        $route.reload()
        JobFactory.toastSuccess(msg)
      })  
      .catch( err => err.msg ? JobFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editRep') {
      chooseOne('Representatives', $scope.Representatives).then( rep_id => {
        JobFactory.getFullRepById({representative_id: rep_id})
          .then(({data}) => addOrEdit(data, 'Representatives', null, rep_id, true)) //------Update Existing
      })
    }

    else if (change === 'addProp') {
      addOrEdit(null, 'Properties')
    } 

    else if (change === 'editProp') {
      addOrEdit($scope.Property, 'Properties', null, null, true)
    }
    resetSelect()
  }


})