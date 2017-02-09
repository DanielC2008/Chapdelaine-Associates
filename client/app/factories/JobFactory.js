'use strict'

app.factory('JobFactory', function($location, $http) {

  const factory = {}

    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`),

    factory.goToEditAllJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}/editAll`) 

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})  

    factory.getActiveJobs = () => $http.get('/api/activeJobs')

    factory.getPendingJobs = () => $http.get('/api/pendingJobs')

    factory.editColumn = columnInfo => $http.post('/api/editColumn', columnInfo)

    factory.getMaxJob = () => $http.get('/api/getMaxJob')

    factory.getMinJob = () => $http.get('/api/getMinJob')

    factory.createNewJob = job_number => $http.post('/api/createNewJob', job_number)

    factory.removeFromJob = dataObj => $http.post('/api/removeFromJob', dataObj)

    factory.addToJob = dataObj => $http.post('/api/addToJob', dataObj)

    factory.addNewToJob = dataObj => $http.post('/api/addNewToJob', dataObj)

    factory.getClientNames = () => $http.get('/api/getClientNames')

    factory.getPropertyAddresses = () => $http.get('/api/getPropertyAddresses')

  return factory
})