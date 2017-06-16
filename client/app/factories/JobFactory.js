'use strict'

app.factory('JobFactory', function($location, $http, $mdToast) {

  const factory = {}


    factory.addNewToJob = dbPackage => {
      if (dbPackage.table === 'Clients'){
        return $http.post('/api/addNewClientToJob', dbPackage)
      } 
      else if (dbPackage.table === 'Representatives'){
        return $http.post('/api/addNewRepToJob', dbPackage)
      } 
      else if (dbPackage.table === 'Properties'){
        return $http.post('/api/addNewPropertyToJob', dbPackage)
      }
    }
    
    factory.addToJob = dataObj => {
      if (dataObj.table === 'Clients'){
        return $http.post('/api/addExistingClientToJob', dataObj)
      }
      else if (dataObj.table === 'Representatives'){
        return $http.post('/api/addExistingRepToJob', dataObj)
      }
    }

    factory.removeFromJob = dataObj => {
      if (dataObj.table === 'Clients') {        
        return $http.post('/api/removeClientFromJob', dataObj)
      }
      else if (dataObj.table === 'Representatives') {        
        return $http.post('/api/removeRepFromJob', dataObj)
      }
      else if (dataObj.table === 'Properties') {        
        return $http.post('/api/removePropertyFromJob', dataObj)
      }
    }

    factory.updateExisting = dbPackage => {
      if (dbPackage.table === 'Clients') {
        return $http.post('/api/updateClient', dbPackage)
      } 
      else if (dbPackage.table === 'Representatives') {
        return $http.post('/api/updateRep', dbPackage)
      }
      else if (dbPackage.table === 'Properties') {        
        return $http.post('/api/updateProp', dbPackage)
      }
    }


    factory.getFullClientById = client_id => $http.post('/api/getFullClientById', client_id)
    factory.getFullRepById = rep_id => $http.post('/api/getFullRepById', rep_id)










    factory.getClientsBySearch = () => $http.get('/api/getClientsBySearch')

    factory.getPropertiesBySearch = () => $http.get('/api/getPropertiesBySearch') //usefull but not utilized currently

    factory.getRepresentativesBySearch = () => $http.get('/api/getRepresentativesBySearch')



    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`)

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})  

    factory.getActiveJobs = () => $http.get('/api/activeJobs')

    factory.getPendingJobs = () => $http.get('/api/pendingJobs')

    factory.editColumn = columnInfo => $http.post('/api/editColumn', columnInfo)

    factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

    factory.getMinJob = () => $http.get('/api/getMinJob')

    factory.createNewJob = newJobObj => $http.post('/api/createNewJob', newJobObj)

    factory.updateJobStatus = jobObj => $http.post('/api/updateJobStatus', jobObj)

    factory.getCauses = () => $http.get('api/getCauses')

    factory.getTasks = () => $http.get('/api/getTasks')

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

    factory.getEditedColumns = (original, edited) => {
      let obj  = {}
      for( let key in original) {
        if (original[key] != edited[`${key}`]) {
          obj[`${key}`] = edited[key]
        }
      }
      return obj
    }

    factory.createArrForChooseOne = (table, options) => {
      return options.map( opt => {
        return {
          id: (table === 'Clients') ? opt.client_id : opt.representative_id,
          name : `${opt.first_name} ${opt.last_name}`
        }  
      })
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