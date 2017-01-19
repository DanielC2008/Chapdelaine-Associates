'use strict'

app.factory('JobFactory', function($location, $http) {

  const factory = {}

    factory.goToJobPage = jobNumber => {
      $location.path(`/jobs/:${jobNumber}`)
    }  

    factory.getJobFromDatabase = job_number => {
      return $http.post('/api/getJobInfo', {job_number})  
    }

    factory.getActiveJobs = () => {
      return $http.get('/api/activeJobs')
    }

    factory.getPendingJobs = () => {
      return $http.get('/api/pendingJobs')
    }

  return factory
})