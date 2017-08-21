'use strict'

app.factory('FindJobFactory', function($http) {

  const factory = {}

  factory.customerConnectTable = dbObj => $http.post('/api/customerConnectTable', dbObj)

  factory.customerForeignKey = dbObj => $http.post('/api/customerForeignKey', dbObj)
  
  factory.customerRegColumn = dbObj => $http.post('/api/customerRegColumn', dbObj)
  
  factory.propertyConnectTable = dbObj => $http.post('/api/propertyConnectTable', dbObj)
  
  factory.propertyForeignKey = dbObj => $http.post('/api/propertyForeignKey', dbObj)
  
  factory.propertyRegColumn = dbObj => $http.post('/api/propertyRegColumn', dbObj)

  factory.searchForJobStatus = dbObj => $http.post('/api/searchForJobStatus', dbObj)

  factory.searchForJobType = dbObj => $http.post('/api/searchForJobType', dbObj)
  
  factory.searchForTasks = dbObj => $http.post('/api/searchForTasks', dbObj)

  factory.getCustomerForFindJob = () => {
    return {
      'Name':           '',
      'Email':          '', 
      'Business Phone': '', 
      'Mobile Phone':   '', 
      'Home Phone':     '', 
      'Fax Number':     '',
      'Address':        '', 
      'City':           '', 
      'State':          '', 
      'Zip Code':       '', 
      'County':         '',
      'Company Name':   ''
    }
  }    

  factory.getPropertyForFindJob = () => {
    return {
      'Address':        '',
      'Road':           '', 
      'City':           '', 
      'State':          '', 
      'Zip Code':       '', 
      'County':         '',
      'Property Map':   '',
      'Parcel Number':  '',
      'Plat Book':      '',
      'Plat Page':      '',
      'Deed Book':      '',  
      'Deed Page':      '',
      'Sub Division':   '',
      'Lot Number':     '',
      'Acres':          ''
    }
  }

  factory.getJobStatusesForFindJob = () => {
    return {
      'Canceled': '',
      'Pending':  '',
      'Hold':     '', 
      'Active':   '',
      'Complete': ''
    }
  }  

  return factory

})
