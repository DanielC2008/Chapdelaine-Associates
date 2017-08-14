'use strict'

app.factory('DBFactory', function($http) {

  const factory = {}

  factory.validate = dbPackage => {
    if (dbPackage.table === 'Customers'){
      return $http.post('/api/validateCustomer', dbPackage)
    } 
    else if (dbPackage.table === 'Properties'){
      return $http.post('/api/validateProp', dbPackage)
    } 
    else if (dbPackage.table === 'Addresses'){
      return $http.post('/api/validateAddress', dbPackage)
    }
    else if (dbPackage.table === 'Roads'){
      return $http.post('/api/validateRoad', dbPackage)
    }
    else if (dbPackage.table === 'Employees'){
      return $http.post('/api/validateEmployee', dbPackage)
    } 
    // else if (dbPackage.table === 'Tasks'){
    //   return $http.post('/api/addNewTask', dbPackage)
    // } 
    // else if (dbPackage.table === 'Job_Types'){
    //   return $http.post('/api/addNewJobType', dbPackage)
    // }
    else if (dbPackage.table === 'Companies'){
      return $http.post('/api/validateCompany', dbPackage)
    }
    // else if (dbPackage.table === 'Cancellations'){
    //   return $http.post('/api/addNewCause', dbPackage)
    // }
  }

  factory.addNew = dbPackage => {
    if (dbPackage.table === 'Customers'){
      return $http.post('/api/addNewCustomer', dbPackage)
    }
    else if (dbPackage.table === 'Properties'){
      return $http.post('/api/addNewPropertyToJob', dbPackage)
    }
    else if (dbPackage.table === 'Jobs'){
      return $http.post('/api/createNewJob', dbPackage)
    }
    else if (dbPackage.table === 'Employees'){
      return $http.post('/api/addNewEmployee', dbPackage)
    } 
    else if (dbPackage.table === 'Tasks'){
      return $http.post('/api/addNewTask', dbPackage)
    } 
    else if (dbPackage.table === 'Job_Types'){
      return $http.post('/api/addNewJobType', dbPackage)
    }
    else if (dbPackage.table === 'Companies'){
      return $http.post('/api/addNewCompany', dbPackage)
    }
    else if (dbPackage.table === 'Cancellations'){
      return $http.post('/api/addNewCause', dbPackage)
    }
    else if (dbPackage.table === 'Addresses'){
      return $http.post('/api/addSecondaryAddress', dbPackage)
    }
    else if (dbPackage.table === 'Roads'){
      return $http.post('/api/addSecondaryRoad', dbPackage)
    }
  }

  factory.updateExisting = dbPackage => {
    if (dbPackage.table === 'Customers') {
      return $http.post('/api/updateCustomer', dbPackage)
    } 
    else if (dbPackage.table === 'Properties') {        
      return $http.post('/api/updateProperty', dbPackage)
    } 
    else if (dbPackage.table === 'Jobs') {        
      return $http.post('/api/updateJob', dbPackage)
    }
    else if (dbPackage.table === 'Employees') {        
      return $http.post('/api/updateEmployee', dbPackage)
    }
    else if (dbPackage.table === 'Tasks'){
      return $http.post('/api/updateTask', dbPackage)
    }
    else if (dbPackage.table === 'Companies'){
      return $http.post('/api/updateCompany', dbPackage)
    }
  }

  factory.removeFromJob = dbPackage => {
    if (dbPackage.table === 'Addresses'){
      return $http.post('/api/removeSecondaryAddress', dbPackage)
    }
    else if (dbPackage.table === 'Roads'){
      return $http.post('/api/removeSecondaryRoad', dbPackage)
    }
    else if (dbPackage.table === 'Job_Types'){
      return $http.post('/api/removeJobTypeFromJob', dbPackage)
    }
  }

  factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

  factory.getMinNumber = table => $http.post('/api/getMinNumber', table)

  factory.updateTable = updateObj => $http.post('/api/updateTable', updateObj)

  factory.updateConnectingTable = updateObj => $http.post('/api/updateConnectingTable', updateObj)

  factory.insertIntoConnectingTable = lineItemObj => $http.post('/api/insertIntoConnectingTable', lineItemObj)
  
  factory.deleteFromConnectingTable = objToRemove => $http.post('/api/deleteFromConnectingTable', objToRemove)

  return factory
})