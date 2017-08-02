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

  //set variables for required info and determining add or edit button AND watch those variables
  const checkIfSet = obj => Object.keys(obj).length === 0 ? false : true
  const setProperty = () => $scope.propertySet = checkIfSet($scope.job.property)
  $scope.$watch('job.property', () => setProperty())
  setProperty()
  const setClient = () => $scope.clientSet = checkIfSet($scope.job.client)
  $scope.$watch('job.client', () => setClient())
  setClient()
  const setClientType = () => $scope.clientTypeSet = checkIfSet($scope.job.client_type)
  $scope.$watch('job.client_type', () => setClientType())
  setClientType()
  const setClientContact = () => $scope.clientContactSet = checkIfSet($scope.job.client_contact)
  $scope.$watch('job.client_contact', () => setClientContact())
  setClientContact()
  const setOwner = () => $scope.ownerSet = checkIfSet($scope.job.owner)
  $scope.$watch('job.owner', () => setOwner())
  setOwner()
  const setOwnerContact = () => $scope.ownerContactSet = checkIfSet($scope.job.owner_contact)
  $scope.$watch('job.owner_contact', () => setOwnerContact())
  setOwnerContact()


  JobTypeFactory.getEnabledJobTypes().then( ({data}) => $scope.types = data.map( type => type.job_type ))

  $scope.material = () => {
    $(document).ready(function() {  
      $('select').material_select()
    })  
  }

  $scope.cancel = () => $mdDialog.hide()

  const submit = () => {
    if (originalJob.job_info.job_status === 'New') {
      JobFormFactory.createJob(defaultJob, $scope.job)
    } else {
      JobFormFactory.updateJob(originalJob, $scope.job)
    }
  }

  $scope.checkReqs = () => {
    let reqMsg = requirements()
    typeof reqMsg === 'string' ? ToastFactory.toastReject(reqMsg) : submit()
  }

  const requirements = () => {
    console.log('$scope.clientSet', $scope.clientSet)
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

  $scope.showCause = cause => $scope.displayCause = cause 

    //customers
      //if client, ensure they cannot send without client
      //just wipe the current customer object, they can choose to add a new one
      //let form factory handle the rest

  $scope.clientTypeChange = () => $scope.clientTypeSet = true

/////////////////////////////////////////JOB TYPES/////////////////////////////////////////  
  $scope.addJobType = type => {
    if (!$scope.job.job_types.includes(type)) {
      $scope.job.job_types.push(type)
    }
  }

  $scope.removeJobType = () => {
    let locals = {optionsArr: $scope.job.job_types}
    $mdDialog.show({
      locals,
      controller: 'ChooseOne as CO',
      templateUrl: '/partials/chooseOne.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    })
    .then( data => $scope.job.job_types.splice($scope.job.job_types.indexOf(data), 1))
    .catch( err => console.log('err', err))
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

/////////////////////////////////////////ADDRESSES/ROADS/////////////////////////////////////////  
  $scope.addAddress = () => {
    PropertyFactory.searchForAddresses().then( selected => {
      let address = selected ? selected.value : null
      if (address) {
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

  $scope.removeAddress = primary => {
    let optionsArr = $scope.job.addresses.reduce( (arr, address) => {
      if (address !== primary) {
        arr.push(address)
      }
      return arr
    },[])
    let locals = {optionsArr: optionsArr}
    $mdDialog.show({
      locals,
      controller: 'ChooseOne as CO',
      templateUrl: '/partials/chooseOne.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    })
    .then( data => $scope.job.addresses.splice($scope.job.addresses.indexOf(data), 1))
    .catch( err => console.log('err', err))
  }

  $scope.addRoad = () => {
    PropertyFactory.searchForRoads().then( selected => {
      let road = selected ? selected.value : null
      if (road) {
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

  $scope.removeRoad = primary => {
    let optionsArr = $scope.job.roads.reduce( (arr, address) => {
      if (address !== primary) {
        arr.push(address)
      }
      return arr
    },[])
    let locals = {optionsArr: optionsArr}
    $mdDialog.show({
      locals,
      controller: 'ChooseOne as CO',
      templateUrl: '/partials/chooseOne.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    })
    .then( data => $scope.job.roads.splice($scope.job.roads.indexOf(data), 1))
    .catch( err => console.log('err', err))
  }

///////////////////////CUSTOMERS////////////////////////////////////////////////////

$scope.removeCustomer = customerType => {
  $scope.job[`${customerType}`] = {}
  console.log('$scope.job', $scope.job)
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