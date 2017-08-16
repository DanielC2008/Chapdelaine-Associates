'use strict'

app.controller('FindJob', function($q, $scope, $http, JobFactory, JobTypeFactory, FormFactory, TaskFactory, FindJobService, FindJobFactory) {

  let FJScope = this
  let numberOfParams = 1
  let values = {}
  FJScope.selectedTable

  $q.all([
    TaskFactory.initialized,
    JobTypeFactory.initialized
  ])
  .then( data => {
    values.Customer = FormFactory.getCustomerForFindJob()
    values.Property = FormFactory.getPropertyForFindJob()
    values['Job Type'] = JobTypeFactory.getJobTypeNames()
    values['Job Status'] = FormFactory.getJobStatusesForFindJob()
    values.Task = TaskFactory.getTaskNames()
    FJScope.Tables = Object.keys(values)
  })
  .catch(err => console.log('err', err))

  FJScope.getTableValues = selected => {
    $scope.material() 
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

  const createObjToFind = obj => {
    obj.objToFind[`${obj.objToFind.column}`] = obj.objToFind.match
    delete obj.objToFind.match
    obj.objToFind = FormFactory.matchDatabaseKeys(obj.objToFind)
    delete obj.objToFind.column
  }

  // if task, job status, or job type: make column the value
  const makeColumnTheValue = obj => {
    obj.objToFind[`${obj.table}`] = obj.objToFind.column
    obj.objToFind = FormFactory.matchDatabaseKeys(obj.objToFind)
    delete obj.objToFind.column
  }

  const propConnectTableColumns = ['address', 'road']
  const foreignKeyColumns = ['address', 'road', 'state', 'zip_code', 'city', 'county', 'company']

  const getPropDBRelation = obj => {
    let column = Object.keys(obj.objToFind)[0]
    if (propConnectTableColumns.includes(column)){
      obj.dbRelation = 'connectTable'
    } else if (foreignKeyColumns.includes(column)){
      obj.dbRelation = 'foreignKey'
    } else {
      obj.dbRelation = 'regColumn'
    }
  }

  const getCustomerDBRelation = obj => {
    let column = Object.keys(obj.objToFind)[0]
    if (foreignKeyColumns.includes(column)){
      obj.dbRelation = 'foreignKey'
    } else {
      obj.dbRelation = 'regColumn'
    }
  }

//submit search parameters
  FJScope.submit = () => {
    let dataArr = removeUnusedParams()
    Promise.all( 
      dataArr.map( obj => {
        return new Promise( (resolve, reject) => {
        ////////////////////Jobs Status////////////////////
          if (obj.table === 'Job Status') {
            makeColumnTheValue(obj)
            FindJobFactory.searchForJobStatus(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
        ////////////////////Jobs Type////////////////////
          if (obj.table === 'Job Type') {
            makeColumnTheValue(obj)
            FindJobFactory.searchForJobType(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          } 
        ////////////////////Task////////////////////
          else if (obj.table === 'Task') {
            makeColumnTheValue(obj)
            FindJobFactory.searchForTasks(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          } 
        ////////////////////Property////////////////////
          else if (obj.table === 'Property') {
            createObjToFind(obj)
            getPropDBRelation(obj)
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
        ////////////////////Customer////////////////////
          else if (obj.table === 'Customer') {
            createObjToFind(obj)
            getCustomerDBRelation(obj)
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
    )
    .then( data => FindJobService.setMatches(data)) 
    .catch( err => {
      console.log('err', err)
      // alert(`The server responded with a status of ${status}: ${data}. Please try another request.`)
    })
  }

  //initiate first parameter
  addParam()
})