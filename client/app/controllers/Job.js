"use strict"

app.controller('Job', function($scope, $location, JobFactory, $mdDialog, $rootScope, $route) {
  let URL = $location.$$url
  $scope.jobNumber = URL.slice(parseInt(URL.search(":") + 1))

  $scope.setNewTab = newTab => {
    $scope.showTab = newTab
    JobFactory.setNewTab({jobNumber: $scope.jobNumber, showTab: newTab})
      .then()
      .catch(err => console.log('err', err))
   }

  const resetSelect = () => {
    $scope.data.select = ''
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
    .catch( () => resetSelect())
  }

  const addNew = (table, client_id = null) => {
    let locals = {
      table: table, 
      ids: {
        job_id: $scope.jobId,
        client_id: client_id 
      },
      editable: null, 
    }
    $mdDialog.show({
      locals,
      fullscreen: true,
      controller: 'Form as FORM',
      templateUrl: '/partials/form.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      escapeToClose: false
    })
    .then( ({msg}) => {
      JobFactory.toastSuccess(msg)
      $route.reload()
    })
    .catch( data => {
      resetSelect()
      data.msg ? JobFactory.toastReject(data.msg) : null
    }) 
  } 

  const editExisiting = (editable, table, rep_id) => {
    let locals = {
      table: table,
      ids: {
        job_id: $scope.jobId,
        rep_id: rep_id
      },
      editable: editable,
    }
    $mdDialog.show({
      locals,
      fullscreen: true,
      controller: 'Form as FORM',
      templateUrl: '/partials/form.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      escapeToClose: false
    })
    .then( ({msg}) => {
      JobFactory.toastSuccess(msg)
      $route.reload()
    })
    .catch( data => {
      resetSelect()
      data.msg ? JobFactory.toastReject(data.msg) : null
    })
  }  

  const chooseOne = (table, options) => {
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
    if (change === 'updateStatus') {
      updateStatus()
    } else if (change === 'addClient') {
      addNew('Clients')
    } else if (change === 'addRep') {
      chooseOne('Clients', $scope.Clients).then( client_id => {
        addNew('Representatives', client_id) 
      })
    } else if (change === 'addProp') {
      addNew('Properties')
    } else if (change === 'editClient') {
      chooseOne('Clients', $scope.Clients).then( clientId => {
        JobFactory.getFullClientById({client_id: clientId})
          .then(({data}) => editExisiting(data, 'Clients'))
      })
    } else if (change === 'editRep') {
      chooseOne('Representatives', $scope.Representatives).then( rep_id => {
        JobFactory.getFullRepById({representative_id: rep_id})
          .then(({data}) => editExisiting(data, 'Representatives', rep_id))
      })
    } else if (change === 'editProp') {
      editExisiting($scope.Property, 'Properties')
    }
  }



})