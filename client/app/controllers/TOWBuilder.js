'use strict'

app.controller('TOWBuilder', function($scope, $http, JobFactory) {
  let TBScope = this
  TBScope.builder = $scope.InvoiceDetails ? $scope.InvoiceDetails : []
  TBScope.type_of_work = null
  
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

  TBScope.getTotal()

})