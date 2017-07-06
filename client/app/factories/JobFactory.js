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
    
    factory.getCauses = () => $http.get('api/getCauses')

    factory.getTab = () => $http.get('/api/getTab')

    factory.setTab = jobNumber => $http.post('/api/setTab', jobNumber)

    factory.setNewTab = jobObj => $http.post('/api/setNewTab', jobObj)

    factory.updateLastAccessed = jobNumber => $http.post('/api/updateLastAccessed', {jobNumber})

    factory.getEnabledJobTypes = () => $http.get('/api/getEnabledJobTypes')

    factory.addNewJobType = () => {
      return new Promise ((resolve, reject) => {
        FormFactory.updateForm('Job_Types', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
      })
    }

    factory.reprioritizeJobTypes = dbPackage => $http.post('/api/reprioritizeJobTypes', {dbPackage})

  return factory
})