'use strict'

app.controller('EstimateJob', function($scope, $http) {
  let EJScope = this
  
  $http.get('/api/typesOfWork')
  .success( data => {
      EJScope.typesOfWork = data
    })
    .error( () => {
      console.log('error')
    })

  EJScope.type_of_work = null
  // let numberOfSelections = 1

  EJScope.estimate = []

  EJScope.getSelectedType = typeOfWork => {
    //http call to database to get specific type of work
    $http.post('/api/getTypeOfWork', {typeOfWork})
      .success( data => {
        EJScope.estimate.push(data)
        EJScope.type_of_work = null
        EJScope.getTotal()
      })
      .error( () => {
        console.log('error')
      })
  }

  EJScope.getTotal = () => {
    EJScope.total = EJScope.estimate.map( ({rate, estimated_hours = 1}) => {
      return rate * estimated_hours
    }).reduce( (total, totalPerHour) => {
      return total + totalPerHour
    }, 0)
  }

})