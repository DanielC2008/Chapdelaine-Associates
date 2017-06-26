'use strict'

app.factory('DBFactory', function($http) {

  const factory = {}

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
  }  

  factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

  factory.getMinNumber = table => $http.post('/api/getMinNumber', table)

  factory.updateTable = updateObj => $http.post('/api/updateTable', updateObj)

  factory.updateConnectingTable = updateObj => $http.post('/api/updateConnectingTable', updateObj)

  factory.insertIntoConnectingTable = lineItemObj => $http.post('/api/insertIntoConnectingTable', lineItemObj)
  
  factory.deleteFromConnectingTable = objToRemove => $http.post('/api/deleteFromConnectingTable', objToRemove)

  return factory
})