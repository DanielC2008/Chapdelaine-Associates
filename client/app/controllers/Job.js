"use strict"

app.controller('Job', function(
  $scope, $location, JobFactory, ToastFactory, $mdDialog, $route, ClientFactory, RepFactory, PropertyFactory) {

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
    let ids = { job_id: $scope.jobId }
    if (change === 'updateStatus') {
      updateStatus()
    }

    else if (change === 'addClient') {
      ClientFactory.addClient(ids).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editClient') { 
      ClientFactory.editClient(ids, $scope.Clients).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'addRep') {
      RepFactory.addRep(ids, $scope.Clients).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editRep') {
      RepFactory.editRep(ids, $scope.Representatives).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    else if (change === 'addProp') {
      PropertyFactory.addProperty(ids).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editProp') {
      ids.property_id = $scope.Property.property_id
      PropertyFactory.editProperty(ids, $scope.Property).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    else if ( change === 'removeClient') {
      ClientFactory.removeClient(ids, $scope.Clients)
       .then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    else if ( change === 'removeRep') {
      RepFactory.removerep(ids, $scope.Representatives)
       .then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }
    resetSelect() 
  }


})