'use strict'

app.controller('JobForm', function($scope, ToastFactory, job, PropertyFactory, CustomerFactory) {
  
  const defaultJob = {
    jobInfo: {
      job_status: 'New'
    },
    property: {},
    addresses : [],
    roads: [],
    client: {},
    clientType: {},
    clientContact: {},
    owner: {},
    ownerContact: {},
    ids: {}
  }
  $scope.job = job ? job : defaultJob
  const originalJob = Object.assign({}, $scope.job)
  //set variables for required info, JobInfo, property, client, and client type
  $scope.propertySet = Object.keys($scope.job.property).length === 0 ? false : true
  $scope.clientSet = Object.keys($scope.job.client).length === 0 ? false : true
  $scope.clientTypeSet = Object.keys($scope.job.clientType).length === 0 ? false : true
  $scope.clientContactSet = Object.keys($scope.job.clientContact).length === 0 ? false : true

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


  $scope.addAddress = () => {
    PropertyFactory.searchForAddresses().then( addresses_id => {
      if (addresses_id) {
        //push address id 
      } else {
        PropertyFactory.addAddress().then( ({dbPackage, msg}) => {
          ToastFactory.toastSuccess(msg)
          $scope.job.addresses.push(dbPackage.dbObj)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    })
  }

  $scope.addRoad = () => {
    PropertyFactory.searchForRoads().then( road_id => {
      if (road_id) {
        //push address id 
      } else {
        PropertyFactory.addRoad().then( ({dbPackage, msg}) => {
          ToastFactory.toastSuccess(msg)
          $scope.job.roads.push(dbPackage.dbObj)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    })
  }

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
/////////////////////////////////////////CLIENT/////////////////////////////////////////
  $scope.addClient = () => { 
      //force user to search for client first
      CustomerFactory.searchForCustomers().then( customer_id => {
        if (customer_id) {
          //if exist bring back full client in case they want to make changes
          CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
            //edit, validate, and on return set obj, clientSet, and id
            CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.client = dbPackage.dbObj
              $scope.clientSet = true
              $scope.job.ids.client_id = dbPackage.customer_id.customer_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          CustomerFactory.addCustomer().then( ({dbPackage, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.client = dbPackage.dbObj
            $scope.clientSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClient = () => {
    //send id for name check if id exists else we are editing a validated client not in DB
    let customer_id = $scope.job.ids.client_id ? $scope.job.ids.client_id : null 
    CustomerFactory.editCustomer($scope.job.client, customer_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.client = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

/////////////////////////////////////////CLIENT CONTACT/////////////////////////////////////////
  $scope.addClientContact = () => { 
      //force user to search for contact first
      CustomerFactory.searchForCustomers().then( customer_id => {
        if (customer_id) {
          //if exist bring back full contact in case they want to make changes
          CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
            //edit, validate, and on return set obj, clientContactSet, and id
            CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.clientContact = dbPackage.dbObj
              $scope.clientContactSet = true
              $scope.job.ids.clientContact_id = dbPackage.customer_id.customer_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          CustomerFactory.addCustomer().then( ({dbPackage, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.clientContact = dbPackage.dbObj
            $scope.clientContactSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClientContact = () => {
    //send id for name check if id exists else we are editing a validated clientContact not in DB
    let customer_id = $scope.job.ids.clientContact_id ? $scope.job.ids.clientContact_id : null 
    CustomerFactory.editCustomer($scope.job.clientContact, customer_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.clientContact = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

/////////////////////////////////////////OWNER/////////////////////////////////////////
  $scope.addOwner = () => { 
      //force user to search for owner first
      CustomerFactory.searchForCustomers().then( customer_id => {
        if (customer_id) {
          //if exist bring back full owner in case they want to make changes
          CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
            //edit, validate, and on return set obj, ownerSet, and id
            CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.owner = dbPackage.dbObj
              $scope.ownerSet = true
              $scope.job.ids.owner_id = dbPackage.customer_id.customer_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          CustomerFactory.addCustomer().then( ({dbPackage, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.owner = dbPackage.dbObj
            $scope.ownerSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editOwner = () => {
    //send id for name check if id exists else we are editing a validated owner not in DB
    let customer_id = $scope.job.ids.owner_id ? $scope.job.ids.owner_id : null 
    CustomerFactory.editCustomer($scope.job.owner, customer_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.owner = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }
/////////////////////////////////////////OWNER CONTACT/////////////////////////////////////////
  $scope.addOwnerContact = () => { 
      //force user to search for contact first
      CustomerFactory.searchForCustomers().then( customer_id => {
        if (customer_id) {
          //if exist bring back full contact in case they want to make changes
          CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
            //edit, validate, and on return set obj, ownerContactSet, and id
            CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.ownerContact = dbPackage.dbObj
              $scope.ownerContactSet = true
              $scope.job.ids.ownerContact_id = dbPackage.customer_id.customer_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          CustomerFactory.addCustomer().then( ({dbPackage, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.ownerContact = dbPackage.dbObj
            $scope.ownerContactSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editOwnerContact = () => {
    //send id for name check if id exists else we are editing a validated ownerContact not in DB
    let customer_id = $scope.job.ids.ownerContact_id ? $scope.job.ids.ownerContact_id : null 
    CustomerFactory.editCustomer($scope.job.ownerContact, customer_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.ownerContact = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

})