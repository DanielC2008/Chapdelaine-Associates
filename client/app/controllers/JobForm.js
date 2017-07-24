'use strict'

app.controller('JobForm', function($scope, ToastFactory, job, PropertyFactory) {
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


})