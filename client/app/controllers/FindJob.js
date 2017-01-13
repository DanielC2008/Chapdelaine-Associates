'use strict'

app.controller('FindJob', function($scope, $http) {
  let FJScope = this

 //connected to database
  // $http.post('/findJob/getTableNames')
  // .success( tableNames => {
  //   $scope.Tables = tableNames.map(table => {
  //     return table.table_name
  //   })
  // })
  // .error( err => {
  //   alert(`${err}`)
  // })
  // not connected to database
  FJScope.Tables = [
    'Clients',
    'Properties',
    'Representatives'
  ]

  FJScope.selectedTable

  //materialize stuff :(
  FJScope.material = () => {
    $(document).ready(function() {  
      $('select').material_select();
    })  
  }

  let numberOfParams = 1

  const values = [
    {
      Clients: [
        'First Name', 'Last Name', 'Address'
      ]
    },
    { Properties: [
       'Parcel Number', 'Map', 'Address'
      ]
    },
    {
      Representatives: [
        'First Name', 'Last Name', 'Address'
      ]
    }
  ]

  FJScope.getTableValues = selected => {
    FJScope.material() 
    values.forEach( table => {
      if (Object.keys(table)[0] === selected) {
        let values = Object.values(table)[0]
        createSelect(values)
      }  
    })
  }

  const createSelect = values => {
    FJScope[`selectedTable${numberOfParams}`] = values
  }


  FJScope.searchParams = []

//adds parameter to searchParams obj
  const addParam = () => {
    let obj = {
      request: null,
      tableName: null,
      values: "*"
    }
    FJScope.searchParams.push(obj)
  }


//create new parameter and display
  FJScope.createParam = () => {
    numberOfParams++
    addParam()
  }
//remove empty params
  const removeUnusedParams = () => {
    let params = FJScope.searchParams.filter( params => {
      return params.tableName
    })
    return params
  }
//submit search parameters
  FJScope.submit = () => {
    let params = removeUnusedParams()
    $http.post('/database', params)
    .success( data => {
      FJScope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
  }

//initiate first parameter
  addParam()
})