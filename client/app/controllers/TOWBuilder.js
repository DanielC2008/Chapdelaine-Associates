'use strict'

app.controller('TOWBuilder', function($scope, $http, JobFactory) {
  let TBScope = this
  TBScope.builder = $scope.InvoiceDetails ? $scope.InvoiceDetails : []
  TBScope.type_of_work = null
  
  JobFactory.getTypesOfWork()
    .then( ({data}) => TBScope.typesOfWork = data.map(obj => obj.type_of_work))
    .catch( ({data}) => console.log(data))

  TBScope.getSelectedType = typeOfWork => {
    //http call to database to get specific type of work
    $http.post('/api/getTypeOfWork', {typeOfWork})
      .then( ({data}) => {
        TBScope.builder.push(data)
        TBScope.type_of_work = null
        TBScope.getTotal()
      })
      .catch( ({data}) => console.log(data))
  }

  TBScope.getTotal = () => TBScope.total = TBScope.builder.map( ({rate, time_if_hourly}) => time_if_hourly ? rate * time_if_hourly : rate).reduce( (total, totalPerHour) => total + totalPerHour, 0)

  TBScope.getTotal()

})