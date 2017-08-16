'use strict'

app.factory('JobTypeFactory', function($q, $http, FormFactory) {
  let jobTypesObj 
  let _initialized = $q.defer() //wait for data to return
  const factory = {}

  factory.addJobTypeToJob = dbPackage => $http.post('/api/addJobTypeToJob', dbPackage)

  factory.addNewJobType = () => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Job_Types', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.disableJobType = id => $http.post('/api/disableJobType', {id})

  factory.reprioritizeJobTypes = dbPackage => $http.post('/api/reprioritizeJobTypes', {dbPackage})

  factory.getJobTypeNames = () => jobTypesObj
  
  factory.getEnabledJobTypes = () => $http.get('/api/getEnabledJobTypes')

  factory.getEnabledJobTypes()
  .then( ({data}) => {
    let Types = data.reduce( (obj, type) => {
      obj[type.job_type] = ''
      return obj
    }, {}) 
    jobTypesObj = Types  
    _initialized.resolve(true) //data has returned and obj is finished pass true to resolve
  }).catch( (data) => console.log(data))

  factory.initialized = _initialized.promise
  
  return factory
})