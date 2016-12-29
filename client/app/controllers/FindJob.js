'use strict'

app.controller('FindJob', function($scope, $http) {
 //connected to database
  $http.post('/findJob/getTableNames')
  .success( tableNames => {
    $scope.Tables = tableNames.map(table => {
      return table.table_name
    })
  })
  .error( err => {
    alert(`${err}`)
  })
  // not connected to database
  // $scope.Tables = [
  //   'Clients',
  //   'Properties',
  //   'Representatives'
  // ]

  $scope.selectedTable
  //materialize stuff :(
  const materialSelect = () => {
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

  $scope.getTableValues = selected => {
    materialSelect() 
    values.forEach( table => {
      if (Object.keys(table)[0] === selected) {
        let values = Object.values(table)[0]
        createSelect(values)
      }  
    })
  }

  const createSelect = values => {
    materialSelect() 
    $scope[`selectedTable${numberOfParams}`] = values
  }


  $scope.searchParams = []

  const addParam = () => {
    materialSelect()
    let obj = {
      request: null,
      tableName: null,
      values: "*"
    }
    $scope.searchParams.push(obj)
  }

  addParam()

  $scope.createParam = () => {
    numberOfParams++
    addParam()
  }

  const removeUnusedParams = () => {
    let params = $scope.searchParams.filter( params => {
      return params.tableName
    })
    return params
  }

  $scope.submit = () => {
    let params = removeUnusedParams()
    $http.post('/database', params)
    .success( data => {
      $scope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
  }
})