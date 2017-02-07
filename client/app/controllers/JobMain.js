'use strict'

app.controller('JobMain', function($scope, $location, JobFactory, $route, $http) {
  let JMScope = this


/////////////FOR EDITING A SINGLE COLUMN///////////////
  JMScope.editOptions = {}
  let editCanceled = {}
  //edit data submited by user    
  JMScope.editDatabase = (table, id, key, value) => {
    removeEditOptions() 
    //make sure user wants to make these changes
    let obj = {}
    //transform key to sql table name
    obj[key.toLowerCase().replace(' ', '_')] = value
    JobFactory.editColumn({table, id, obj})
      .then( ({data: {msg}}) => alert(msg))
      .catch( ({data: {msg}}) => alert(msg))
  }

  //set edit options on obj for easy comparison and edit canceled obj so data isn't lost 
  JMScope.setEditOptions = (editType, tableName, tableIndex, index, key, value) => {
    JMScope.editOptions.editType = editType
    JMScope.editOptions.tableName = tableName
    JMScope.editOptions.tableIndex = tableIndex
    JMScope.editOptions.inputIndex = index
    editCanceled.key = key
    editCanceled.value = value
  }

  //focuses specific editOne
  JMScope.changeFocus = (tableName, tableIndex, index) => {
    if (index == $scope.inputIndex && tableIndex == $scope.tIndex && tableName == $scope.table) {
      return true
    }
  }
  
  //if user cancels edit, reset ng-model
  JMScope.revertEditChanges = obj => {
    removeEditOptions()    
    obj[editCanceled.key] = editCanceled.value
  }
  //lodash for deep equals
  JMScope.compareObj = currDiv => _.isEqual(JMScope.editOptions, currDiv)
  //set editOptions back to null
  const removeEditOptions = () => {
    for(let key in JMScope.editOptions) {
        JMScope.editOptions[key] = null
    } 
  }


/////////////ADD OR REMOVE FROM JOB///////////////
  JMScope.addClientBySearch = () => {
    $http
      .get('/api/getClientNames')//should pass in user_id here
      .then(({data}) => {
        //set these on this scope so filter function has access to it
        $scope.table = 'Jobs_Clients' 
        $scope.items = data
        JMScope.addClientBy = 'search'
      })
      .catch(err => console.log(err))
  }

  JMScope.addPropertyBySearch = () => {
    $http
      .get('/api/getPropertyAddresses')//should pass in user_id here
      .then(({data}) => {
        $scope.table = 'Jobs_Properties' 
        $scope.items = data
        JMScope.addPropertyBy = 'search'
      })
      .catch(err => console.log(err))
  }

  JMScope.removeFromJob = (table, objToRemove, job_number) => {
    let dataObj = {
      table,
      objToRemove,
      job_number
    }
    JobFactory.removeFromJob(dataObj)
      .then( ({data}) => $route.reload())
      .catch( ({data}) => console.log(data))
  }


})