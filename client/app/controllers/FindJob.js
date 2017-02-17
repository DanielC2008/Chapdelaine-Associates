'use strict'

app.controller('FindJob', function($scope, $http, JobFactory, TableAndColumnFactory) {
  let FJScope = this
  let HCScope = $scope.$parent
  let numberOfParams = 1
  let values = TableAndColumnFactory
  FJScope.selectedTable
  
 // connected to database
  $http.post('/api/findJob/getTableNames')
    .then( ({data}) => {
      FJScope.Tables = data.map( table => {
        return table.table_name
      })
    })
    .catch( ({data}) => alert(data))



  FJScope.getTableValues = selected => {
    HCScope.material() 
    for(let obj in values) {
      if (obj === selected) {
        let getValues = Object.keys(values[obj])
        createSelect(getValues)
      }
    }
  }

  const createSelect = values => {
    FJScope[`selectedTable${numberOfParams}`] = values
  }


  FJScope.searchParams = []

//adds parameter to searchParams obj
  const addParam = () => {
    FJScope.searchParams.push({})
  }


//create new parameter and display
  FJScope.createParam = () => {
    numberOfParams++
    addParam()
  }
//remove empty params
  const removeUnusedParams = () => {
    let params = FJScope.searchParams.filter( param => {
      delete param.$$hashKey
      return param.table
    })
    return params
  }
//submit search parameters
  FJScope.submit = () => {
    let params = removeUnusedParams()
    console.log(params);
    // $http.post('/api/database', params)
    //   .then( ({data}) => {
    //     FJScope.recentJobs = data
    //  })
    //  .catch( ({data}) => console.log(({data})))
  }

//initiate first parameter
  addParam()
})