"use strict"

app.controller('Job', function(
  $scope, $location, JobFactory, ToastFactory, SearchFactory, $mdDialog, $route, ClientFactory, RepFactory, PropertyFactory) {

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
        jobNumber: $scope.Job.job_number,
        onHold: $scope.Job.on_hold
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
      ClientFactory.searchForClients().then( client_id => {
        ids.client_id = client_id
        if (client_id) {
          ClientFactory.getFullClientById({ids}).then( ({data}) => {
            ClientFactory.addExistingClientToJob(ids, data).then( ({msg}) => {
              $route.reload()
              ToastFactory.toastSuccess(msg)
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          ClientFactory.addNewClient(ids).then( data => {
            $route.reload()
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editClient') { 
      SearchFactory.chooseOne('Clients', $scope.Clients).then( client_id => {
        ids.client_id = client_id
        ClientFactory.getFullClientOnJob({ids}).then( ({data}) => {
          ClientFactory.updateExistingClient(ids, data).then( ({msg}) => {
            $route.reload()
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if ( change === 'removeClient') {
      SearchFactory.chooseOne('Clients', $scope.Clients).then( client_id => {
        ids.client_id = client_id
        ClientFactory.removeClientFromJob(ids).then( ({data: {msg}}) => {
          $route.reload()
          ToastFactory.toastSuccess(msg)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    else if (change === 'addRep') {
      SearchFactory.chooseOne('Clients', $scope.Clients).then( client_id => {
        ids.client_id = client_id
        RepFactory.searchForReps().then( rep_id => {
          ids.representative_id = rep_id
          if (rep_id) {
            RepFactory.getFullRepById({ids}).then( ({data}) => {
              RepFactory.addExistingRepToJob(ids, data).then( ({msg}) => {
                $route.reload()
                ToastFactory.toastSuccess(msg)
              }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          } else {
            RepFactory.addNewRep(ids).then( ({msg}) => {
              $route.reload()
              ToastFactory.toastSuccess(msg)
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    } 

    else if (change === 'editRep') {
      SearchFactory.chooseOne('Representatives', $scope.Representatives).then( rep_id => {
        ids.representative_id = rep_id
        RepFactory.getFullRepById({ids}).then( ({data}) => {
          RepFactory.updateExistingRep(ids, data).then( ({msg}) => {
            $route.reload()
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    else if ( change === 'removeRep') { //requires client and job ids to remove
      SearchFactory.chooseOne('Representatives', $scope.Representatives).then( rep_id => {
        ids.client_id = $scope.Representatives.filter( reps => reps.representative_id = rep_id)[0].client_id
        RepFactory.removeFromJob(ids).then( ({data: {msg}}) => {
          $route.reload()
          ToastFactory.toastSuccess(msg)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))  
    }

 

    else if (change === 'editProp') {
      ids.property_id = $scope.Property.property_id
      PropertyFactory.editProperty(ids, $scope.Property).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    else if (change === 'addAddressRoad') {
      ids.property_id = $scope.Property.property_id
      PropertyFactory.addAddressRoad(ids).then( ({msg}) => {
        $route.reload()
        ToastFactory.toastSuccess(msg)
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }

    resetSelect() 
  }


})