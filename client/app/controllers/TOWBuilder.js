'use strict'

app.controller('TOWBuilder', function($scope, $http, JobFactory) {
  let TBScope = this
  TBScope.builder = $scope.InvoiceDetails ? _.cloneDeep($scope.InvoiceDetails) : []
  TBScope.edit = null
  TBScope.type_of_work = null

  JobFactory.getTypesOfWork()
    .then( ({data}) => {
      TBScope.typesOfWork = data
      TBScope.types = data.map(obj => obj.type_of_work)
   })
    .catch( ({data}) => console.log(data))

  TBScope.getSelectedType = selectedType => {
    getTotal()
    TBScope.type_of_work = null
    TBScope.typesOfWork.forEach( type => { 
      if (type.type_of_work == selectedType){
        TBScope.builder.push(type)
        addLineItem(type)
      }
    })  
  }

  const getTotal = () => TBScope.total = TBScope.builder.map( ({rate, time_if_hourly}) => time_if_hourly ? rate * time_if_hourly : rate).reduce( (total, totalPerHour) => total + totalPerHour, 0)

  const addLineItem = type => {
    let lineItemObj = {
      table: $scope.tableForDB,
      objToAdd: {
        invoice_id: $scope.Invoice.invoice_id,
        type_of_work_id: type.type_of_work_id,
      }
    }
    if (type.hourly) {
      lineItemObj.objToAdd.time_if_hourly = 1
      TBScope.edit = TBScope.builder.length - 1
    }
    JobFactory.addLineItem(lineItemObj)
      .then( () => JobFactory.toastSuccess())
      .catch( (data) => console.log('data', data))
  }

  TBScope.updateLineItem = lineItem  => {
    getTotal()
    TBScope.edit = null
    let updateObj = {
      table: $scope.tableForDB,
      idOne: {invoice_id: $scope.Invoice.invoice_id},
      idTwo: {type_of_work_id: lineItem.type_of_work_id},
      columnsToUpdate : {time_if_hourly: lineItem.time_if_hourly}
    }
    JobFactory.updateConnectingTable(updateObj)
      .then( () => JobFactory.toastSuccess())
      .catch( (data) => console.log('data', data))
  }

  TBScope.deleteLineItem = (lineItem, index) => {
    TBScope.builder.splice(index, 1)
    let objToRemove = {
      table: $scope.tableForDB,
      idOne: {invoice_id: $scope.Invoice.invoice_id},
      idTwo: {type_of_work_id: lineItem.type_of_work_id}
    }
    JobFactory.deleteFromConnectingTable(objToRemove)
      .then( () => JobFactory.toastSuccess())
      .catch( (data) => console.log('data', data))
  }

  getTotal()

})