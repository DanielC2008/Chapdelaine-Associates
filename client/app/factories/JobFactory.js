'use strict'

app.factory('JobFactory', function($location, $http, $mdToast) {

  const factory = {}


    factory.addNewToJob = dataObj => {
      if (dataObj.table === 'Clients'){
        return $http.post('/api/addNewClientToJob', dataObj)
      } 
      else if (dataObj.table === 'Representatives'){
        return $http.post('/api/addNewRepToJob', dataObj)
      } 
      else if (dataObj.table === 'Properties'){
        return $http.post('/api/addNewPropertyToJob', dataObj)
      }
    }
    
    factory.addToJob = dataObj => {
      if (dataObj.table === 'Clients'){
        return $http.post('/api/addExistingClientToJob', dataObj)
      }
      else if (dataObj.table === 'Representatives'){
        return $http.post('/api/addExistingRepToJob', dataObj)
      }
      //else if Props
    }

    factory.removeFromJob = dataObj => {
      if (dataObj.table === 'Clients') {        
        return $http.post('/api/removeClientFromJob', dataObj)
      }
      else if (dataObj.table === 'Representatives') {        
        return $http.post('/api/removeRepFromJob', dataObj)
      }
      //else if Props
    }


    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`)

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})  

    factory.getActiveJobs = () => $http.get('/api/activeJobs')

    factory.getPendingJobs = () => $http.get('/api/pendingJobs')

    factory.editColumn = columnInfo => $http.post('/api/editColumn', columnInfo)

    factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

    factory.getMinJob = () => $http.get('/api/getMinJob')

    factory.createNewJob = job_number => $http.post('/api/createNewJob', job_number)


    


    factory.getClientsBySearch = () => $http.get('/api/getClientsBySearch')

    factory.getPropertiesBySearch = () => $http.get('/api/getPropertiesBySearch')

    factory.getRepresentativesBySearch = () => $http.get('/api/getRepresentativesBySearch')

    factory.getTypesOfWork = () => $http.get('/api/getTypesOfWork')

    factory.findJob = dataArr => $http.post('/api/findJob', dataArr)

    factory.updateTable = updateObj => $http.post('/api/updateTable', updateObj)

    factory.updateConnectingTable = updateObj => $http.post('/api/updateConnectingTable', updateObj)

    factory.insertIntoConnectingTable = lineItemObj => $http.post('/api/insertIntoConnectingTable', lineItemObj)
    
    factory.deleteFromConnectingTable = objToRemove => $http.post('/api/deleteFromConnectingTable', objToRemove)

    factory.openFile = attachment_id => $http.post('/api/openFile', attachment_id)

    factory.deleteFile = attachment_id => $http.post('/api/deleteFile', attachment_id)

    factory.getUserName = () => $http.get('/api/getUserName')

    factory.removeUser = () => $http.get('/api/removeUser')

    factory.getTab = () => $http.get('/api/getTab')

    factory.setTab = jobNumber => $http.post('/api/setTab', jobNumber)

    factory.setNewTab = jobObj => $http.post('/api/setNewTab', jobObj)

    factory.updateLastAccessed = jobNumber => $http.post('/api/updateLastAccessed', {jobNumber})
   
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

    factory.toastSuccess = message => {
      let msg = message === undefined ? 'Success' : message
      return $mdToast.show(
        $mdToast.simple()
          .textContent(`${msg}`)
          .position('top right')
          .hideDelay(3000)
          .toastClass('toastSuccess')
      )
    }

    factory.toastReject = message => {
      let msg = message === undefined ? 'Error' : message
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