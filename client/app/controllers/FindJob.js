'use strict'

app.controller('FindJob', function($scope, $http, JobFactory, TableAndColumnFactory, FindJobService) {
  let FJScope = this
  let HCScope = $scope.$parent
  let numberOfParams = 1
  let values
  TableAndColumnFactory.initialized.then(function() {
    values = TableAndColumnFactory.getObj()
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
      
      if (obj.table == 'Types Of Work') { //----------------------------type of work: make column the value
        obj.objToFind.type_of_work = obj.objToFind.column
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
    .then( ({data}) => FindJobService.setFoundJobs(data))
    .catch( ({data}) => console.log('data', data))
  }

//initiate first parameter
  addParam()
  FindJobService.sortJobs([[{job_number: 1234}, {job_number: 1235}], [{job_number: 1234}, {job_number: 1236}], [{job_number: 1236}]])
})