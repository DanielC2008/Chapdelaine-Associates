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
    else if (dbPackage.table === 'AddressRoad'){
      return $http.post('/api/addSecondaryAddressOrRoad', dbPackage)
    }
  }

  factory.addNew = dbPackage => {
    if (dbPackage.table === 'Clients'){
      return $http.post('/api/addNewClient', dbPackage)
    } 
    else if (dbPackage.table === 'Representatives'){
      return $http.post('/api/addNewRep', dbPackage)
    } 
    else if (dbPackage.table === 'Properties'){
      return $http.post('/api/addNewPropertyToJob', dbPackage)
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
    else if (dbPackage.table === 'AddressRoad'){
      return $http.post('/api/addSecondaryAddressOrRoad', dbPackage)
    }
  }
  
  factory.addExisting = dbPackage => {
    if (dbPackage.table === 'Clients'){
      return $http.post('/api/addExistingClient', dbPackage)
    }
    else if (dbPackage.table === 'Representatives'){
      return $http.post('/api/addExistingRep', dbPackage)
    }
  }

  factory.removeFromJob = dataObj => {
    if (dataObj.table === 'Clients') {        
      return $http.post('/api/removeClientFromJob', dataObj)
    }
    else if (dataObj.table === 'Representatives') {        
      return $http.post('/api/removeRepFromJob', dataObj)
    }
  }

  factory.updateExisting = dbPackage => {
    if (dbPackage.table === 'Clients') {
      return $http.post('/api/updateClient', dbPackage)
    } 
    else if (dbPackage.table === 'Representatives') {
      return $http.post('/api/updateRep', dbPackage)
    }
    else if (dbPackage.table === 'Properties') {        
      return $http.post('/api/updateProperty', dbPackage)
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

  factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

  factory.getMinNumber = table => $http.post('/api/getMinNumber', table)

  factory.updateTable = updateObj => $http.post('/api/updateTable', updateObj)

  factory.updateConnectingTable = updateObj => $http.post('/api/updateConnectingTable', updateObj)

  factory.insertIntoConnectingTable = lineItemObj => $http.post('/api/insertIntoConnectingTable', lineItemObj)
  
  factory.deleteFromConnectingTable = objToRemove => $http.post('/api/deleteFromConnectingTable', objToRemove)

  return factory
})