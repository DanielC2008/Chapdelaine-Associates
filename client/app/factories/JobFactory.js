'use strict'

app.factory('JobFactory', function($location, $http, $mdToast) {

  const factory = {}

    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`),

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

    factory.getClientsBySearch = () => $http.get('/api/getClientsBySearch')

    factory.getPropertiesBySearch = () => $http.get('/api/getPropertiesBySearch')

    factory.getRepresentativesBySearch = () => $http.get('/api/getRepresentativesBySearch')
   
    /////////////////////////////////might put these elsewhere
    factory.matchDatabaseKeys = obj => {
      for (let key in obj){
        obj[key.toLowerCase().replace(' ', '_')] = obj[key]
        delete obj[key]
      }
      return obj
    }

    factory.createCurrentClientArray = clients => {

      let clientArray = clients.map( client => {
        let obj = {
          client_id: client.client_id,
          client_name : `${client['First Name']} ${client['Last Name']}`
        }  
        return obj
      })
      return clientArray
    }

    factory.toastReject = msg => {
      return $mdToast.show(
        $mdToast.simple()
          .textContent(`${msg}`)
          .position('top right')
          .hideDelay(3000)
          .toastClass('toastReject')
      )
    }

  return factory
})