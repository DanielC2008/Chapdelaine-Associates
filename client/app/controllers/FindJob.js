'use strict'

app.controller('FindJob', function($q, $scope, JobTypeFactory, TaskFactory, FindJobService, FindJobFactory, FormFactory, ToastFactory, $location, $rootScope) {

  let numberOfParams = 1
  const FJScope = this
  const values = {}
  const propConnectTableColumns = ['address', 'road']
  const foreignKeyColumns = ['address', 'road', 'state', 'zip_code', 'city', 'county', 'company']
  FJScope.selectedTable
  FJScope.searchParams = []

  $q.all([
    TaskFactory.initialized,
    JobTypeFactory.initialized
  ])
  .then( data => {
    values.Customer = FindJobFactory.getCustomerForFindJob()
    values.Property = FindJobFactory.getPropertyForFindJob()
    values['Job Type'] = JobTypeFactory.getJobTypeNames()
    values['Job Status'] = FindJobFactory.getJobStatusesForFindJob()
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

  const createSelect = values => FJScope[`selectedTable${numberOfParams}`] = values

  //adds parameter to searchParams obj
  const addParam = () => FJScope.searchParams.push({})

  //create new parameter and display
  FJScope.createParam = () => {
    //if the first param is filled out
    if (FJScope.searchParams[`${numberOfParams - 1}`].table && FJScope.searchParams[`${numberOfParams - 1}`].objToFind) { 
      numberOfParams++
      addParam()
    }
  }

  //remove empty params
  const removeUnusedParams = () => FJScope.searchParams.filter( param => param.table)

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
    console.log('dataArr', dataArr)
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
    .then( data => {
      console.log('data', data)
      let { length } = data.filter( arr => arr.length > 0 )
      if (length === 0){
        ToastFactory.toastReject('Oooops! No matches found')
      } else {
        FindJobService.setMatches(data).then( () => $rootScope.$apply( () => $location.path('/jobs/')))
      }  
    })
    .catch( err => console.log('err', err))
  }

  //initiate first parameter
  addParam()
})