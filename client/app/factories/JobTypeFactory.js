'use strict'

app.factory('JobTypeFactory', function($http, FormFactory) {

  const factory = {}

  factory.getEnabledJobTypes = () => $http.get('/api/getEnabledJobTypes')

  factory.addNewJobType = () => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Job_Types', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.disableJobType = id => $http.post('/api/disableJobType', {id})

  factory.reprioritizeJobTypes = dbPackage => $http.post('/api/reprioritizeJobTypes', {dbPackage})
  
  return factory
})