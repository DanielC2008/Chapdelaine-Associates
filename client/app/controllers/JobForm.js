'use strict'

app.controller('JobForm', function($scope, ToastFactory, job, PropertyFactory, ClientFactory) {
  
  /////////////////////////WILL NEED ID STORAGE/////////////////////////
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
    ownerRep: {}
  }
  $scope.job = job ? job : defaultJob
  const originalJob = Object.assign({}, $scope.job)
  //set variables for required info, JobInfo, property, client, and client type
  $scope.propertySet = Object.keys($scope.job.property).length === 0 ? false : true
  $scope.clientSet = Object.keys($scope.job.client).length === 0 ? false : true

  $scope.showCause = cause => $scope.displayCause = cause 

  $scope.setDate = (date, type) => {
    let MM = date.getMonth() + 1
    let DD = date.getDate()
    let YYYY = date.getFullYear()
    let formatedDate = `${YYYY}-${MM}-${DD}`
    $scope.job.jobInfo[`${type}_date`] = formatedDate
    $scope[`${type}Date`] = null
  }

  $scope.addProp = () =>{ 
    PropertyFactory.addProp().then( ({dbObj, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.property = dbObj
      $scope.propertySet = true
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editProp = () =>{
    PropertyFactory.editProp($scope.job.property).then( ({dbObj, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.property = dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.addClient = () =>{ 
      ClientFactory.searchForClients().then( client_id => {
        if (client_id) {
          // ClientFactory.getFullClientById({ids}).then( ({data}) => {
          //   ClientFactory.addClient().then( ({dbObj, msg}) => {
          //     ToastFactory.toastSuccess(msg)
          //     $scope.job.client = dbObj
          //     $scope.clientSet = true
          //   }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          // }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          ClientFactory.addClient().then( ({dbObj, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.client = dbObj
            $scope.clientSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClient = () =>{
    ClientFactory.editClient($scope.job.client).then( ({dbObj, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.client = dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }


})