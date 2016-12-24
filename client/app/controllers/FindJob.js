'use strict'

app.controller('FindJob', function($scope, $http) {
  $scope.selectedTable
  //materialize stuff :(
  const materialSelect = () => {
    $(document).ready(function() {  
      $('select').material_select();
    })  
  }

  let numberOfParams = 1

  $scope.Tables = [
    'Clients',
    'Properties',
    'Representatives'
  ]

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

  $scope.getTableValues = (selected) => {
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
    let obj = {}
    $scope.searchParams.push(obj)
  }

  addParam()

  $scope.createParam = () => {
    numberOfParams++
    addParam()
  }

  $scope.submit = () => {
    $http.post('/database', $scope.searchParams)
    .success( data => {
      $scope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
  }
})