'use strict'

app.controller('JobForm', function($scope, ToastFactory, job, PropertyFactory, ClientFactory) {
  
  const defaultJob = {
    jobInfo: {
      job_status: 'New'
    },
    property: {},
    addresses : {},
    roads: {},
    client: {},
    clientType: {},
    clientRep: {},
    owner: {},
    ownerRep: {},
    ids: {}
  }
  $scope.job = job ? job : defaultJob
  const originalJob = Object.assign({}, $scope.job)
  //set variables for required info, JobInfo, property, client, and client type
  $scope.propertySet = Object.keys($scope.job.property).length === 0 ? false : true
  $scope.clientSet = Object.keys($scope.job.client).length === 0 ? false : true
  $scope.clientTypeSet = Object.keys($scope.job.clientType).length === 0 ? false : true

  $scope.showCause = cause => $scope.displayCause = cause 

  $scope.setDate = (date, type) => {
    let MM = date.getMonth() + 1
    let DD = date.getDate()
    let YYYY = date.getFullYear()
    let formatedDate = `${YYYY}-${MM}-${DD}`
    $scope.job.jobInfo[`${type}_date`] = formatedDate
    $scope[`${type}Date`] = null
  }

  $scope.clientTypeChange = () => $scope.clientTypeSet = true

  $scope.addProp = () => { 
    PropertyFactory.addProp().then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.property = dbPackage.dbObj
      $scope.propertySet = true
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editProp = () => {
    PropertyFactory.editProp($scope.job.property).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.property = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.addClient = () => { 
      //force user to search for client first
      ClientFactory.searchForClients().then( client_id => {
        if (client_id) {
          //if exist bring back full client in case they want to make changes
          ClientFactory.getFullClientById({client_id}).then( ({data}) => {
            //edit, validate, and on return set obj, clientSet, and id
            ClientFactory.editClient(data, data.client_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.client = dbPackage.dbObj
              $scope.clientSet = true
              $scope.job.ids.client_id = dbPackage.client_id.client_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          ClientFactory.addClient().then( ({dbObj, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.client = dbObj
            $scope.clientSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClient = () => {
    //send id for name check if id exists else we are editing a validated client not in DB
    let client_id = $scope.job.ids.client_id ? $scope.job.ids.client_id : null 
    ClientFactory.editClient($scope.job.client, client_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.client = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }


})