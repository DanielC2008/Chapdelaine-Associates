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
  }

  const addNew = table => {
    let locals = {
      table: table, 
      job_id: $scope.jobId,
      clientArray: null,
      editable: null
    }
    if (table == 'Representatives') {
      locals.clientArray = JobFactory.createCurrentClientArray($scope.Clients)
    }
    $mdDialog.show({
      locals,
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
    .catch( data => data.msg ? JobFactory.toastReject(data.msg) : null)
  } 



  const editExisiting = table => {
    let locals = {
      table: table, 
      job_id: $scope.jobId,
      clientArray: null,
      editable: $scope.Main
    }
    $mdDialog.show({
      locals,
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
    .catch( data => data.msg ? JobFactory.toastReject(data.msg) : null)
  }  

  //const chooseOne...


  $scope.update = change => {
    if (change === 'updateStatus') {
      updateStatus()
    } else if (change === 'addClient') {
      addNew('Clients')
    } else if (change === 'addRep') {
      addNew('Representatives')
    } else if (change === 'addProp') {
      addNew('Properties')
    } else if (change === 'editClient') {
      editExisiting('Clients')
    } else if (change === 'editRep') {
      editExisiting('Representatives')
    } else if (change === 'editProp') {
      editExisiting('Properties')
    }
  }



})