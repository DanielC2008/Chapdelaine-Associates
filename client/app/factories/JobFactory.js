'use strict'

app.factory('JobFactory', function($location, $http) {

  const factory = {}

    factory.goToJobPage = jobNumber => {
      $location.path(`/jobs/:${jobNumber}`)
    }  

    factory.getJobFromDatabase = jobNumber => {
      return $http.post('/getJob', {jobNumber})  
    }

    factory.getActiveJobs = () => {
      return $http.get('/activeJobs')
    }

    factory.getPendingJobs = () => {
      return $http.get('/pendingJobs')
    }

  return factory
})