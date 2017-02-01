'use strict'

app.controller('EstimateJob', function($scope, $http) {
  let EJScope = this
  
  $http.get('/api/typesOfWork')
    .then( ({data}) => EJScope.typesOfWork = data)
    .catch( ({data}) => console.log(data))

  EJScope.type_of_work = null
  // let numberOfSelections = 1

  EJScope.estimate = []

  EJScope.getSelectedType = typeOfWork => {
    //http call to database to get specific type of work
    $http.post('/api/getTypeOfWork', {typeOfWork})
      .then( ({data}) => {
        EJScope.estimate.push(data)
        EJScope.type_of_work = null
        EJScope.getTotal()
      })
      .catch( ({data}) => console.log(data))
  }

  EJScope.getTotal = () => {
    EJScope.total = EJScope.estimate.map( ({rate, estimated_hours = 1}) => {
      return rate * estimated_hours
    }).reduce( (total, totalPerHour) => {
      return total + totalPerHour
    }, 0)
  }

})