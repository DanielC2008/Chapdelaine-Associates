'use strict'

app.controller('FindJob', function($scope, $http) {
  let FJScope = this
  let HCScope = $scope.$parent
 // connected to database
  $http.post('/api/findJob/getTableNames')
    .then( ({data}) => {
      FJScope.Tables = data.map( table => {
        return table.table_name
      })
    })
    .catch( ({data}) => alert(data))

  FJScope.selectedTable

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
    HCScope.material() 
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
    $http.post('/api/database', params)
      .then( ({data}) => {
        FJScope.recentJobs = data
     })
     .catch( ({data}) => console.log(({data})))
  }

//initiate first parameter
  addParam()
})