'use strict'

app.factory('JobFactory', function($location, $http, FormFactory) {

  const factory = {}

    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`)

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})  

    factory.getActiveJobs = () => $http.get('/api/activeJobs') //will remove

    factory.getPendingJobs = () => $http.get('/api/pendingJobs') //will remove

    factory.createNewJob = newJobObj => $http.post('/api/createNewJob', newJobObj)

    factory.updateJobStatus = jobObj => $http.post('/api/updateJobStatus', jobObj)

    factory.findJob = dataArr => $http.post('/api/findJob', dataArr)
    
    factory.getTab = () => $http.get('/api/getTab')

    factory.setTab = jobNumber => $http.post('/api/setTab', jobNumber)

    factory.setNewTab = jobObj => $http.post('/api/setNewTab', jobObj)

    factory.updateLastAccessed = jobNumber => $http.post('/api/updateLastAccessed', {jobNumber})


    //Job Types -- might move
    factory.getEnabledJobTypes = () => $http.get('/api/getEnabledJobTypes')

    factory.addNewJobType = () => {
      return new Promise ((resolve, reject) => {
        FormFactory.updateForm('Job_Types', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
      })
    }

    factory.disableJobType = id => $http.post('/api/disableJobType', {id})

    factory.reprioritizeJobTypes = dbPackage => $http.post('/api/reprioritizeJobTypes', {dbPackage})
    

    //Cause For Cancellation -- might move
    factory.getCauses = () => $http.get('api/getCauses')

    factory.addNewCause = () => {
      return new Promise ((resolve, reject) => {
        FormFactory.updateForm('Cause_For_Cancellation', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
      })
    }

  return factory
})