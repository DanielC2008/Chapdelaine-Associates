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
    else if (dbPackage.table === 'Tasks'){
      return $http.post('/api/validateTask', dbPackage)
    } 
    else if (dbPackage.table === 'Job_Types'){
      return $http.post('/api/validateJobType', dbPackage)
    }
    else if (dbPackage.table === 'Companies'){
      return $http.post('/api/validateCompany', dbPackage)
    }
    else if (dbPackage.table === 'Cancellations'){
      return $http.post('/api/validateCause', dbPackage)
    }
  }

  factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

  factory.getMinNumber = table => $http.post('/api/getMinNumber', table)

  factory.updateTable = updateObj => $http.post('/api/updateTable', updateObj)

  factory.insertSimple = dbPackage => $http.post('/api/insertSimple', dbPackage)

  factory.updateConnectingTable = updateObj => $http.post('/api/updateConnectingTable', updateObj)

  factory.insertIntoConnectingTable = lineItemObj => $http.post('/api/insertIntoConnectingTable', lineItemObj)
  
  factory.deleteFromConnectingTable = objToRemove => $http.post('/api/deleteFromConnectingTable', objToRemove)

  return factory
})