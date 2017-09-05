'use strict'

app.controller('JobForm', function($rootScope, $scope, $mdDialog, job, AlertFactory, PropertyFactory, CustomerFactory, JobTypeFactory,  JobFormFactory, FormFactory) {

  let clientEdited = false
  let ownerEdited = false
  let clientContactEdited = false
  let ownerContactEdited = false
  //using an obj to store status set on scope so changes force a digest and form will return to previous status is status change is canceled. 
  $scope.statusObj = {
    status: job ? job.job_info.job_status : ''
  }

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

  /////////////////////DATE STUFF///////////////////
  //set startDate as a seperate variable than start_date on job Obj so when original and 
    //update objs are compared in jobFormFactory it does not detect a change in the isoString 
    //which would result in resaving the date obj everytime the jobForm was hit
  const setOffset = isoDate => {
    if (isoDate) {
      let date = new Date(isoDate)
      let tzoffset = date.setTime( date.getTime() + new Date().getTimezoneOffset() * 60000 )
      return new Date(tzoffset)
    } else {
      return null
    }
  }
  //set timezone only one initial variables, user input dates have offset already
  $scope.startDate = setOffset($scope.job.job_info.start_date)
  $scope.completeDate = setOffset($scope.job.job_info.complete_date)
  $scope.targetDate = setOffset($scope.job.job_info.target_date)

  // watch tasks check if objs are equal if true does nothing which prevents setting startDate to iso String on page load
  $scope.$watch( 'job.job_info.start_date', () => {
    if (_.isEqual($scope.startDate, setOffset($scope.job.job_info.start_date))) {
      return
    } else {
      $scope.startDate = $scope.job.job_info.start_date
    }
  })

  $scope.$watch( 'job.job_info.complete_date', () => {
    if (_.isEqual($scope.completeDate, setOffset($scope.job.job_info.complete_date))) {
      return
    } else {
      $scope.completeDate = $scope.job.job_info.complete_date
    }
  })

  $scope.$watch( 'job.job_info.target_date', () => {
    if (_.isEqual($scope.targetDate, setOffset($scope.job.job_info.target_date))) {
      return
    } else {
      $scope.targetDate = $scope.job.job_info.target_date
    }
  })

  $scope.changeDate = (date, type) => $scope.job.job_info[`${type}`] = date

  //set variables for required info and determining add or edit button AND watch those variables
  const checkIfSet = obj => Object.keys(obj).length === 0 ? false : true
  const setProperty = () => $scope.propertySet = checkIfSet($scope.job.property)
  $scope.$watch('job.property', () => setProperty())
  setProperty()
  const setClient = () => $scope.clientSet = checkIfSet($scope.job.client)
  $scope.$watch('job.client', () => setClient())
  setClient()
  const setClientType = () => $scope.clientTypeSet = checkIfSet($scope.job.client_type)
  $scope.$watch('job.client_type.client_type', () => setClientType())
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
  const setJobType = () => $scope.jobTypeSet = $scope.job.job_types.length === 0 ? false : true
  $scope.$watch('job.job_types.length', () => setJobType())
  setJobType()
  const setJobStatus = () => {
    $scope.statusObj.status = $scope.job.job_info.on_hold ? 'Hold' : $scope.job.job_info.job_status
    $scope.jobStatusSet = $scope.job.job_info.job_status === 'New' ? false : true
    if ($scope.job.job_info.job_status !== 'Active' && $scope.job.job_info.job_status !== 'Complete') {
      $scope.requireStartDate = false
      $scope.requireCompleteDate = false
    } else if ( $scope.job.job_info.job_status === 'Active' ) {
      $scope.requireStartDate = true
      $scope.requireCompleteDate = false
    } else if ( $scope.job.job_info.job_status === 'Complete' ) {
      $scope.requireStartDate = true 
      $scope.requireCompleteDate = true
    }

  }  
  $scope.$watch('job.job_info.job_status', () => setJobStatus())
  setJobStatus()

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
    typeof reqMsg === 'string' ? AlertFactory.toastReject(reqMsg) : submit()
  }

  const requirements = () => {
    if (!$scope.jobStatusSet) {
      return 'Please set job status.'
    } else if (!$scope.jobTypeSet) {
      return 'Please set job type.'
    } else if ($scope.requireStartDate && !$scope.job.job_info.start_date) {
      return 'Please set start date.'
    } else if ($scope.requireCompleteDate && !$scope.job.job_info.complete_date) {
      return 'Please set complete date.'
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
      clickOutsideToClose: false,
      escapeToClose: false,
      multiple: true
    })
    .then( data => $scope.job.job_types.splice($scope.job.job_types.indexOf(data), 1))
    .catch( err => console.log('err', err))
  }

/////////////////////////////////////////PROPERTY/////////////////////////////////////////  
  $scope.addProp = () => { 
    FormFactory.updateForm('Properties', null, {}, 'Add New').then( ({dbPackage, msg}) => {
      AlertFactory.toastSuccess(msg)
      $scope.job.property = dbPackage.dbObj
      $scope.propertySet = true
    }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editProp = () => {
    FormFactory.updateForm('Properties', $scope.job.property, {}, 'Update').then( ({dbPackage, msg}) => {
      AlertFactory.toastSuccess(msg)
      $scope.job.property = dbPackage.dbObj
    }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

/////////////////////////////////////////ADDRESSES/ROADS/////////////////////////////////////////  
  $scope.addAddress = () => {
    PropertyFactory.searchForAddresses().then( selected => {
      let address = selected ? selected.value : null
      if (address) {
        $scope.job.addresses.push(address)
        $scope.$apply()
      } else {
        FormFactory.updateForm('Addresses', null,  {}, 'Add New').then( ({dbPackage, msg}) => {
          AlertFactory.toastSuccess(msg)
          $scope.job.addresses.push(dbPackage.dbObj)
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
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
      clickOutsideToClose: false,
      escapeToClose: false,
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
        FormFactory.updateForm('Roads', null,  {}, 'Add New').then( ({dbPackage, msg}) => {
          AlertFactory.toastSuccess(msg)
          $scope.job.roads.push(dbPackage.dbObj)
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
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
      clickOutsideToClose: false,
      escapeToClose: false,
      multiple: true
    })
    .then( data => $scope.job.roads.splice($scope.job.roads.indexOf(data), 1))
    .catch( err => console.log('err', err))
  }

/////////////////////////////////////////CUSTOMERS////////////////////////////////////

$scope.removeCustomer = customerType => {
  $scope.job.ids[`${customerType}_id`] = null
  $scope.job[`${customerType}`] = {}
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
              FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
              AlertFactory.toastSuccess(msg)
              $scope.job.client = dbPackage.dbObj
              $scope.job.ids.client_id = dbPackage.ids.customer_id
            }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        } else {
           FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New').then( ({dbPackage, msg}) => {
            AlertFactory.toastSuccess(msg)
            $scope.job.client = dbPackage.dbObj
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClient = () => {
    let customer_id = $scope.job.ids.client_id ? $scope.job.ids.client_id : null
    //if there is an id and the user has not already edited the customer during this form session get customer from db
    if (customer_id && !clientEdited) {
      CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
        FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
          AlertFactory.toastSuccess(msg)
          $scope.job.client = dbPackage.dbObj
          clientEdited = true
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    //if the customer has created a new customer or has already edited the existing customer during this form session use scope
    } else {
      FormFactory.updateForm('Customers', $scope.job.client, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
        AlertFactory.toastSuccess(msg)
        $scope.job.client = dbPackage.dbObj
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    }
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
              FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
              AlertFactory.toastSuccess(msg)
              $scope.job.client_contact = dbPackage.dbObj
              $scope.job.ids.client_contact_id = dbPackage.ids.customer_id
            }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        } else {
           FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New').then( ({dbPackage, msg}) => {
            AlertFactory.toastSuccess(msg)
            $scope.job.client_contact = dbPackage.dbObj
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editClientContact = () => {
    let customer_id = $scope.job.ids.client_contact_id ? $scope.job.ids.client_contact_id : null
    //if there is an id and the user has not already edited the customer during this form session get customer from db
    if (customer_id && !clientContactEdited) {
      CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
        FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
          AlertFactory.toastSuccess(msg)
          $scope.job.client_contact = dbPackage.dbObj
          clientContactEdited = true
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    //if the customer has created a new customer or has already edited the existing customer during this form session use scope
    } else {
      FormFactory.updateForm('Customers', $scope.job.client_contact, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
        AlertFactory.toastSuccess(msg)
        $scope.job.client_contact = dbPackage.dbObj
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    }
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
              FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
              AlertFactory.toastSuccess(msg)
              $scope.job.owner = dbPackage.dbObj
              $scope.job.ids.owner_id = dbPackage.ids.customer_id
            }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        } else {
           FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New').then( ({dbPackage, msg}) => {
            AlertFactory.toastSuccess(msg)
            $scope.job.owner = dbPackage.dbObj
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editOwner = () => {
    let customer_id = $scope.job.ids.owner_id ? $scope.job.ids.owner_id : null
    //if there is an id and the user has not already edited the customer during this form session get customer from db
    if (customer_id && !ownerEdited) {
      CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
        FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
          AlertFactory.toastSuccess(msg)
          $scope.job.owner = dbPackage.dbObj
          ownerEdited = true
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    //if the customer has created a new customer or has already edited the existing customer during this form session use scope
    } else {
      FormFactory.updateForm('Customers', $scope.job.owner, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
        AlertFactory.toastSuccess(msg)
        $scope.job.owner = dbPackage.dbObj
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    }
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
              FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
              AlertFactory.toastSuccess(msg)
              $scope.job.owner_contact = dbPackage.dbObj
              $scope.job.ids.owner_contact_id = dbPackage.ids.customer_id
            }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        } else {
           FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New').then( ({dbPackage, msg}) => {
            AlertFactory.toastSuccess(msg)
            $scope.job.owner_contact = dbPackage.dbObj
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        }
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  }

  $scope.editOwnerContact = () => {
    let customer_id = $scope.job.ids.owner_contact_id ? $scope.job.ids.owner_contact_id : null
    //if there is an id and the user has not already edited the customer during this form session get customer from db
    if (customer_id && !ownerContactEdited) {
      CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
        FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
          AlertFactory.toastSuccess(msg)
          $scope.job.owner_contact = dbPackage.dbObj
          ownerContactEdited = true
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    //if the customer has created a new customer or has already edited the existing customer during this form session use scope
    } else {
      FormFactory.updateForm('Customers', $scope.job.owner_contact, {customer_id: customer_id}, 'Update').then( ({dbPackage, msg}) => {
        AlertFactory.toastSuccess(msg)
        $scope.job.owner_contact = dbPackage.dbObj
      }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
    }
  }

})