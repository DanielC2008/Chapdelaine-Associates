'use strict'

app.factory('JobFactory', function($location, $http) {

  const factory = {}

    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`)

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})

    factory.findJob = dataArr => $http.post('/api/findJob', dataArr)
    
    factory.getTab = () => $http.get('/api/getTab')

    factory.setTab = jobNumber => $http.post('/api/setTab', jobNumber)

    factory.setNewTab = jobObj => $http.post('/api/setNewTab', jobObj)

    factory.updateLastAccessed = dbObj => $http.post('/api/updateLastAccessed', dbObj)

    factory.checkJobNumberExists = job_number => $http.post('/api/checkJobNumberExists', {job_number})

  return factory
})