'use strict'

app.controller('EstimateJob', function($scope, $http) {
  let EJScope = this
  
  $http.get('/typesOfWork')
  .success( data => {
      EJScope.typesOfWork = data
    })
    .error( () => {
      console.log('error')
    })

  EJScope.type_of_work = null
  // let numberOfSelections = 1

  EJScope.estimate = []

  // const addSelectedType = () => {
  //   let obj = {
  //     type_of_work: null,
  //     rate: null,
  //     hourly: null
  //   }
  //   EJScope.estimate.push(obj)
  // }

  EJScope.getSelectedType = typeOfWork => {
    //http call to database to get specific type of work
    $http.post('/getTypeOfWork', {typeOfWork})
      .success( data => {
        EJScope.estimate.push(data)
        EJScope.type_of_work = null
      })
      .error( () => {
        console.log('error')
      })
  }

  EJScope.getTotal = () => {

  }

})