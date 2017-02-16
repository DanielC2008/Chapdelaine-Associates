'use strict'

app.controller('JobMain', function($scope, $location, JobFactory, $route, $mdDialog) {
  let JMScope = this


/////////////FOR EDITING A SINGLE COLUMN///////////////
  JMScope.editOptions = {}
  let editCanceled = {}
  //edit data submited by user    
  JMScope.editDatabase = (table, id, key, value) => {
    removeEditOptions() 
    //make sure user wants to make these changes
    let obj = JobFactory.matchDatabaseKeys({[key]: value})
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
  JMScope.addBySearch = table => {
     JobFactory[`get${table}BySearch`]()//should pass in user_id here
      .then(({data}) => {
        //set these on this scope so filter function has access to it
        $scope.table = table 
        $scope.items = data
        JMScope.search = true
      })
      .catch(err => console.log(err))

  }

  JMScope.removeFromJob = (table, objToRemove) => {
    let dataObj = {
      table,
      objToRemove,
      job_id: {job_id: $scope.jobId},
    }
    JobFactory.removeFromJob(dataObj)
      .then( ({data: {msg}}) => {
      JobFactory.toastSuccess(msg)
      $route.reload()
    })
      .catch( () => JobFactory.toastReject())
  }

  JMScope.addNew = table => {
    let locals = {
      table: table, 
      job_id: {job_id: $scope.jobId},
      clientArray: null
    }
    if (table == 'Representatives') {
      locals.clientArray = JobFactory.createCurrentClientArray($scope.Clients)
    }
    $mdDialog.show({
      locals,
      controller: 'AddNew as NEW',
      templateUrl: '/partials/addNew.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      escapeToClose: false
    }).then( ({msg}) => {
      JobFactory.toastSuccess(msg)
      $route.reload()
    })
      .catch( data => data.msg ? JobFactory.toastReject(data.msg) : null)
  }  


})