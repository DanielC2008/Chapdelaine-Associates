"use strict"

app.controller('Job', function($scope, $location, JobFactory, $mdDialog, $rootScope, $route, ClientFactory) {
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

  const chooseOne = (table, options) => { //FF userSelectForId
    let locals = { optionsArr : JobFactory.createArrForChooseOne(table, options) }
    return new Promise ((resolve, reject) => {
      $mdDialog.show({
        locals,
        controller: 'ChooseOne as CO',
        templateUrl: '/partials/chooseOne.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false
      })
      .then( id => resolve(id))
      .catch(err => console.log(err))
    })
  }

  $scope.update = change => {
      console.log('$scope.select', $scope.select)
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
      .catch( err => {
        err.msg ? JobFactory.toastReject(err.msg) : console.log('err', err)
      })
    } 

    else if (change === 'editClient') { 
      chooseOne('Clients', $scope.Clients).then( client_id => {
        let ids = {job_id: $scope.jobId, client_id: client_id}
        JobFactory.getFullClientOnJob({ids})
        .then(({data}) => {
          addOrEdit(data, 'Clients', client_id, null, true) //---------------------------Update Existing
        })
      })
    } 

    else if (change === 'addRep') {
      chooseOne('Clients', $scope.Clients).then( client_id => {
        addBySearch('Representatives')
        .then( rep_id => {
          if (rep_id) {
            JobFactory.getFullRepById({representative_id: rep_id}).then(({data}) => { 
              addOrEdit(data, 'Representatives', client_id, rep_id) //--------------------add Existing
            })
          } else {
            addOrEdit(null, 'Representatives', client_id) //------------------------------add New
          }
        })
        .catch( err => {
          resetSelect()
          err.msg ? JobFactory.toastReject(err.msg) : null
        })
      })
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