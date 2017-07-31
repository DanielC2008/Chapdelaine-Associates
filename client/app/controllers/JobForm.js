'use strict'

app.controller('JobForm', function($scope, ToastFactory, job, PropertyFactory, CustomerFactory, JobTypeFactory, $mdDialog, JobFormFactory) {

  const defaultJob = {
    job_info: {
      job_status: 'New',
      job_number: null,
    },
    job_types: [],
    property: {},
    addresses : [],
    roads: [],
    client: {},
    client_type: {},
    client_contact: {},
    owner: {},
    owner_contact: {},
    ids: {}
  }
  let originalJob = _.cloneDeep(job ? job : defaultJob)
  $scope.job = _.cloneDeep(job ? job : defaultJob)
  console.log('$scope.job', $scope.job)
  //set variables for required info and determining add or edit button
  $scope.propertySet = Object.keys($scope.job.property).length === 0 ? false : true
  $scope.clientSet = Object.keys($scope.job.client).length === 0 ? false : true
  $scope.clientTypeSet = Object.keys($scope.job.client_type).length === 0 ? false : true
  $scope.clientContactSet = Object.keys($scope.job.client_contact).length === 0 ? false : true
  $scope.ownerSet = Object.keys($scope.job.owner).length === 0 ? false : true
  $scope.ownerContactSet = Object.keys($scope.job.owner_contact).length === 0 ? false : true

  JobTypeFactory.getEnabledJobTypes().then( ({data}) => $scope.types = data.map( type => type.job_type ))

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  const submit = () => {
    if (originalJob.job_info.job_status === 'New') {
      JobFormFactory.createJob(defaultJob, $scope.job)
    } else {
      // JobFormFactory.updateJob(originalJob, $scope.job)
    }
  }

  $scope.checkReqs = () => {
    let reqMsg = requirements()
    typeof reqMsg === 'string' ? ToastFactory.toastReject(reqMsg) : submit()
  }

  const requirements = () => {
    if ($scope.job.job_info.job_status === 'New') {
      return 'Please set job status.'
    } else if ($scope.job.job_info.job_type < 1) {
      return 'Please set job type.'
    } else if (!$scope.propertySet) {
      return 'Please create a new Property.'
    } else if (!$scope.clientSet) {
      return 'Please assign a Client.'
    } else if (!$scope.clientTypeSet) {
      return 'Please choose a Client Type.'
    } else {
      return
    }
  } 

  $scope.cancel = () => $mdDialog.hide()

  $scope.showCause = cause => $scope.displayCause = cause 

  $scope.clientTypeChange = () => $scope.clientTypeSet = true

  $scope.addJobType = type => {
    if (!$scope.job.job_types.includes(type)) {
      $scope.job.job_types.push(type)
    }
  }

/////////////////////////////////////////PROPERTY/////////////////////////////////////////  
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

  $scope.addAddress = () => {
    PropertyFactory.searchForAddresses().then( selected => {
      let address = selected ? {address: selected.value} : null
      if (address) {
        //could save ids here
        $scope.job.addresses.push(address)
        $scope.$apply()
      } else {
        PropertyFactory.addAddress().then( ({dbPackage, msg}) => {
          ToastFactory.toastSuccess(msg)
          $scope.job.addresses.push(dbPackage.dbObj)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    })
  }

 $scope.addRoad = () => {
    PropertyFactory.searchForRoads().then( selected => {
      let road = selected ? {road: selected.value} : null
      if (road) {
        //could save ids here
        $scope.job.roads.push(road)
        $scope.$apply()
      } else {
        PropertyFactory.addRoad().then( ({dbPackage, msg}) => {
          ToastFactory.toastSuccess(msg)
          $scope.job.roads.push(dbPackage.dbObj)
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    })
  }

/////////////////////////////////////////CLIENT/////////////////////////////////////////
  $scope.addClient = () => { 
      //force user to search for client first
      CustomerFactory.searchForCustomers().then( selected => {
        let customer_id = selected ? selected.id : null
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
      CustomerFactory.searchForCustomers().then( selected => {
        let customer_id = selected ? selected.id : null
        if (customer_id) {
          //if exist bring back full contact in case they want to make changes
          CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
            //edit, validate, and on return set obj, clientContactSet, and id
            CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.client_contact = dbPackage.dbObj
              $scope.clientContactSet = true
              $scope.job.ids.client_contact_id = dbPackage.customer_id.customer_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          CustomerFactory.addCustomer().then( ({dbPackage, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.client_contact = dbPackage.dbObj
            $scope.clientContactSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClientContact = () => {
    //send id for name check if id exists else we are editing a validated client_contact not in DB
    let customer_id = $scope.job.ids.clientContact_id ? $scope.job.ids.clientContact_id : null 
    CustomerFactory.editCustomer($scope.job.client_contact, customer_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.client_contact = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

/////////////////////////////////////////OWNER/////////////////////////////////////////
  $scope.addOwner = () => { 
      //force user to search for owner first
      CustomerFactory.searchForCustomers().then( selected => {
        let customer_id = selected ? selected.id : null
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
      CustomerFactory.searchForCustomers().then( selected => {
        let customer_id = selected ? selected.id : null
        if (customer_id) {
          //if exist bring back full contact in case they want to make changes
          CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
            //edit, validate, and on return set obj, ownerContactSet, and id
            CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage, msg}) => {
              ToastFactory.toastSuccess(msg)
              $scope.job.owner_contact = dbPackage.dbObj
              $scope.ownerContactSet = true
              $scope.job.ids.owner_contact_id = dbPackage.customer_id.customer_id
            }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        } else {
          CustomerFactory.addCustomer().then( ({dbPackage, msg}) => {
            ToastFactory.toastSuccess(msg)
            $scope.job.owner_contact = dbPackage.dbObj
            $scope.ownerContactSet = true
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editOwnerContact = () => {
    //send id for name check if id exists else we are editing a validated owner_contact not in DB
    let customer_id = $scope.job.ids.ownerContact_id ? $scope.job.ids.ownerContact_id : null 
    CustomerFactory.editCustomer($scope.job.owner_contact, customer_id).then( ({dbPackage, msg}) => {
      ToastFactory.toastSuccess(msg)
      $scope.job.owner_contact = dbPackage.dbObj
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

})