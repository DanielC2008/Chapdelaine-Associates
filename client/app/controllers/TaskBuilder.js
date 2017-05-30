'use strict'

app.controller('TaskBuilder', function($scope, $http, JobFactory) {
  let TBScope = this
  let {table, id, connectingTableId} = $scope.DBObj
  let allTasks
  TBScope.builder = $scope.Details ? _.cloneDeep($scope.Details) : []
  TBScope.edit = null
  TBScope.task = null

  JobFactory.getTasks()
    .then( ({data}) => {
      allTasks = data
      TBScope.tasks = data.map(obj => obj.task)
   })
    .catch( ({data}) => console.log(data))

  TBScope.getSelectedTask = selectedTask => {
    TBScope.task = null
    allTasks.forEach( task => { 
      if (task.task == selectedTask){
        addLineItem(task)
      }
    })  
  }

  const getTotal = () => TBScope.total = TBScope.builder.map( ({rate, time_if_hourly}) => time_if_hourly ? rate * time_if_hourly : rate).reduce( (total, totalPerHour) => total + totalPerHour, 0)

  const addLineItem = task => {
    let lineItemObj = {
      table,
      objToAdd: {}
    }

    lineItemObj.objToAdd[`${id}`] =  $scope[`${table}`][`${id}`]
    lineItemObj.objToAdd.task_id = task.task_id

    if (task.hourly) {
      lineItemObj.objToAdd.time_if_hourly = 1
    }
    JobFactory.insertIntoConnectingTable(lineItemObj)
      .then( ({data}) => {
        let addTask = _.cloneDeep(task)
        addTask[`${connectingTableId}`] = data[0]
        TBScope.builder.push(addTask)
        TBScope.edit = TBScope.builder.length - 1
        getTotal()
        JobFactory.toastSuccess()
      })
      .catch( (data) => console.log('data', data))
  }

  TBScope.updateLineItem = lineItem  => {
    TBScope.edit = null
    let updateObj = {
      table,
      id: lineItem[`${connectingTableId}`],
      columnsToUpdate : {time_if_hourly: lineItem.time_if_hourly}
    }
    JobFactory.updateConnectingTable(updateObj)
      .then( () => {
        getTotal()
        JobFactory.toastSuccess()
      })
      .catch( (data) => console.log('data', data))
  }

  TBScope.deleteLineItem = (lineItem, index) => {
    TBScope.builder.splice(index, 1)
    let objToRemove = {
      table,
      id: lineItem[`${connectingTableId}`]
    }
    JobFactory.deleteFromConnectingTable(objToRemove)
      .then( () => {
        getTotal()
        JobFactory.toastSuccess()
      })
      .catch( (data) => console.log('data', data))
  }

  getTotal()

})