'use strict'

app.controller('TOWBuilder', function($scope, $http, JobFactory) {
  let TBScope = this
  TBScope.builder = $scope.InvoiceDetails ? _.cloneDeep($scope.InvoiceDetails) : []
  let invoiceLength = $scope.InvoiceDetails.length
  TBScope.type_of_work = null
  TBScope.edit = null

  JobFactory.getTypesOfWork()
    .then( ({data}) => {
      TBScope.typesOfWork = data
      TBScope.types = data.map(obj => obj.type_of_work)
   })
    .catch( ({data}) => console.log(data))

  TBScope.getSelectedType = selectedType => {
    TBScope.typesOfWork.forEach( type => { 
      if (type.type_of_work == selectedType){
        TBScope.builder.push(type)
      }
    })  
    TBScope.type_of_work = null
    TBScope.getTotal()
  }

  TBScope.getTotal = () => TBScope.total = TBScope.builder.map( ({rate, time_if_hourly}) => time_if_hourly ? rate * time_if_hourly : rate).reduce( (total, totalPerHour) => total + totalPerHour, 0)

  TBScope.addLineItems = () => {
    let lineItemArr = TBScope.builder.slice(invoiceLength).reduce( (itemArr, item) => {
      let obj = {}
      obj.type_of_work_id = item.type_of_work_id
      obj.time_if_hourly = item.time_if_hourly ? Number(item.time_if_hourly) : null
      obj.invoice_id = $scope.Invoice.invoice_id
      itemArr.push(obj)
      return itemArr
    }, [])
    JobFactory.addLineItem({lineItemArr})
      .then( () => {
        JobFactory.toastSuccess()
        invoiceLength = TBScope.builder.length 
      })
      .catch( ({data}) => console.log('data', data))
  }

  TBScope.updateLineItem = lineItem => {
    TBScope.edit = null
    let updateObj = {
      table: $scope.tableForDB,
      idOne: {invoice_id: $scope.Invoice.invoice_id},
      idTwo: {type_of_work_id: lineItem.type_of_work_id},
      columnsToUpdate : {time_if_hourly: lineItem.time_if_hourly}
    }
    JobFactory.updateConnectingTable(updateObj)
      .then( () => {
        JobFactory.toastSuccess()
      })
      .catch( ({data}) => console.log('data', data))
  }

  TBScope.getTotal()

})