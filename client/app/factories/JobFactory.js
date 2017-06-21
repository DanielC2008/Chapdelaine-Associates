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
    
    factory.addExistingToJob = dbPackage => {
      if (dbPackage.table === 'Clients'){
        return $http.post('/api/addExistingClientToJob', dbPackage)
      }
      else if (dbPackage.table === 'Representatives'){
        return $http.post('/api/addExistingRepToJob', dbPackage)
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
        return $http.post('/api/updateProperty', dbPackage)
      }
    }

    factory.getFullRepById = rep_id => $http.post('/api/getFullRepById', rep_id)




    //Job Factory
    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`)

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})  

    factory.getActiveJobs = () => $http.get('/api/activeJobs')

    factory.getPendingJobs = () => $http.get('/api/pendingJobs')

    factory.createNewJob = newJobObj => $http.post('/api/createNewJob', newJobObj)

    factory.updateJobStatus = jobObj => $http.post('/api/updateJobStatus', jobObj)

    factory.findJob = dataArr => $http.post('/api/findJob', dataArr)
    
    factory.getCauses = () => $http.get('api/getCauses')

    factory.getTab = () => $http.get('/api/getTab')

    factory.setTab = jobNumber => $http.post('/api/setTab', jobNumber)

    factory.setNewTab = jobObj => $http.post('/api/setNewTab', jobObj)

    factory.updateLastAccessed = jobNumber => $http.post('/api/updateLastAccessed', {jobNumber})


    //Task Factory or FF
    factory.getTasks = () => $http.get('/api/getTasks')

    //Attachment Factory

    factory.openFile = attachment_id => $http.post('/api/openFile', attachment_id)

    factory.deleteFile = attachment_id => $http.post('/api/deleteFile', attachment_id)


    //????
    factory.getMaxNumber = table => $http.post('/api/getMaxNumber', table)

    factory.getMinJob = () => $http.get('/api/getMinJob')

    factory.updateTable = updateObj => $http.post('/api/updateTable', updateObj)

    factory.updateConnectingTable = updateObj => $http.post('/api/updateConnectingTable', updateObj)

    factory.insertIntoConnectingTable = lineItemObj => $http.post('/api/insertIntoConnectingTable', lineItemObj)
    
    factory.deleteFromConnectingTable = objToRemove => $http.post('/api/deleteFromConnectingTable', objToRemove)


    //User Factory
    factory.getUserName = () => $http.get('/api/getUserName')

    factory.removeUser = () => $http.get('/api/removeUser')

    factory.createArrForChooseOne = (table, options) => { //FF
      return options.map( opt => {
        return {
          id: (table === 'Clients') ? opt.client_id : opt.representative_id,
          name : `${opt.first_name} ${opt.last_name}`
        }  
      })
    }


    // Toast Factory
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