'use strict'

app.controller('FindJob', function($scope, $http, JobFactory, FormFactory, FindJobService) {
  let FJScope = this
  let HCScope = $scope.$parent
  let numberOfParams = 1
  let values = {}

  FormFactory.initialized.then(function() {
    values.Clients = FormFactory.getClientForm()
    values.Representatives = FormFactory.getRepresentativeForm()
    values.Properties = FormFactory.getPropertyForm()
    values.Job = FormFactory.getJobForm()
    values.Tasks = FormFactory.getTaskForm()
    FJScope.Tables = Object.keys(values)
  })
  FJScope.selectedTable


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

  const createObjToFind = dataArr => {
    dataArr.map( obj => {
      
      if (obj.table == 'Tasks') { //----------------------------task: make column the value
        obj.objToFind.task = obj.objToFind.column
      } else {                            //----------------------------everything else make column key and match value and send to matchdbkeys
        obj.objToFind[`${obj.objToFind.column}`] = obj.objToFind.match
        delete obj.objToFind.match
        obj.objToFind = JobFactory.matchDatabaseKeys(obj.objToFind)
      }
      delete obj.objToFind.column
    })
  }

//submit search parameters
  FJScope.submit = () => {
    let dataArr = removeUnusedParams()
    createObjToFind(dataArr)
    JobFactory.findJob(dataArr)
    .then( ({data}) => 
      FindJobService.setMatches(data))
    .catch( ({data, status}) => alert(`The server responded with a status of ${status}: ${data}. Please try another request.`))
  }

//initiate first parameter
  addParam()
})