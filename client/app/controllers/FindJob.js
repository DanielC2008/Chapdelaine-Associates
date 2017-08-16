'use strict'

app.controller('FindJob', function($scope, $http, JobFactory, FormFactory, TaskFactory, FindJobService, FindJobFactory) {
  let FJScope = this
  let HCScope = $scope.$parent
  let numberOfParams = 1
  let values = {}

  TaskFactory.initialized.then(function() {
    values.Customers = FormFactory.getCustomerForFindJob()
    values.Properties = FormFactory.getPropertyForFindJob()
    values.Job = FormFactory.getJobForm()
    values.Tasks = TaskFactory.getTaskNames()
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
    dataArr.forEach( obj => {
      
      if (obj.table == 'Tasks') { //----------------------------task: make column the value
        obj.objToFind.task = obj.objToFind.column
      } else {                            //----------------------------everything else make column key and match value and send to matchdbkeys
        obj.objToFind[`${obj.objToFind.column}`] = obj.objToFind.match
        delete obj.objToFind.match
        obj.objToFind = FormFactory.matchDatabaseKeys(obj.objToFind)
      }
      delete obj.objToFind.column
    })
  }

  const propConnectTableColumns = ['address', 'road']
  const foreignKeyColumns = ['address', 'road', 'state', 'zip_code', 'city', 'county', 'company']

  const getPropDBRelation = dataArr => {
    dataArr.forEach( obj => {
      let column = Object.keys(obj.objToFind)[0]
      if (propConnectTableColumns.includes(column)){
        obj.dbRelation = 'connectTable'
      } else if (foreignKeyColumns.includes(column)){
        obj.dbRelation = 'foreignKey'
      } else {
        obj.dbRelation = 'regColumn'
      }
    })
  }

  const getCustomerDBRelation = dataArr => {
    dataArr.forEach( obj => {
      let column = Object.keys(obj.objToFind)[0]
      if (foreignKeyColumns.includes(column)){
        obj.dbRelation = 'foreignKey'
      } else {
        obj.dbRelation = 'regColumn'
      }
    })
  }

//submit search parameters
  FJScope.submit = () => {
    let dataArr = removeUnusedParams()
    createObjToFind(dataArr)
    Promise.all( dataArr.map( obj => {
      return new Promise( (resolve, reject) => {
  ////////////////////Jobs////////////////////
        if (obj.table === 'Job') {
          FindJobFactory.searchForJobStatus(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
        } 
  ////////////////////Tasks////////////////////
        else if (obj.table === 'Tasks') {
          FindJobFactory.searchForTasks(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
        } 
  ////////////////////Properties////////////////////
        else if (obj.table === 'Properties') {
          getPropDBRelation(dataArr)
          console.log('dataArr', dataArr)
          if (obj.dbRelation === 'connectTable') {
            FindJobFactory.propertyConnectTable(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
          else if (obj.dbRelation === 'foreignKey') {
            FindJobFactory.propertyForeignKey(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
          else if (obj.dbRelation === 'regColumn') {
            FindJobFactory.propertyRegColumn(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
        } 
  ////////////////////Customers////////////////////
        else if (obj.table === 'Customers') {
          getCustomerDBRelation(dataArr)
          console.log('dataArr', dataArr)
          if (obj.dbRelation === 'connectTable') {
            FindJobFactory.customerConnectTable(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
          else if (obj.dbRelation === 'foreignKey') {
            FindJobFactory.customerForeignKey(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
          else if (obj.dbRelation === 'regColumn') {
            FindJobFactory.customerRegColumn(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
        }
      })
    })
      // JobFactory.findJob(dataArr)
    )
    .then( data => {
      console.log('data', data)
     }) 
    //   // FindJobService.setMatches(data))
    .catch( err => {
      console.log('err', err)
      // alert(`The server responded with a status of ${status}: ${data}. Please try another request.`)
    })
  }

//initiate first parameter
  addParam()
})