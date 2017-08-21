'use strict'

app.controller('FindJob', function($q, $scope, JobTypeFactory, TaskFactory, FindJobService, FindJobFactory, FormFactory, ToastFactory, $location, $rootScope) {

  let numberOfParams = 1
  const FJScope = this
  const tables = {}
  const propConnectTableColumns = ['address', 'road']
  const foreignKeyColumns = ['address', 'road', 'state', 'zip_code', 'city', 'county', 'company']
  FJScope.searchParams = []

  Promise.all([
    TaskFactory.getAllTasks().then( ({data}) => {
      return data.reduce( (obj, task) => {
        obj[task.task] = ''
        return obj
      }, {})
    })
    // JobTypeFactory.initialized
  ])
  .then( data => {
    tables.Customer = FindJobFactory.getCustomerForFindJob()
    tables.Property = FindJobFactory.getPropertyForFindJob()
    tables['Job Type'] = JobTypeFactory.getJobTypeNames()
    tables['Job Status'] = FindJobFactory.getJobStatusesForFindJob()
    tables.Task = data[0]
    FJScope.Tables = Object.keys(tables)
    $scope.$apply()
  })
  .catch(err => console.log('err', err))

  FJScope.noUserInput = index => {
    if (!FJScope.searchParams[index].table || 
        FJScope.searchParams[index].table == "Task" || 
        FJScope.searchParams[index].table == "Job Status" || 
        FJScope.searchParams[index].table == "Job Type") {
      return true
    } else {
      return false
    }
  }

  FJScope.getTableValues = (selected, index) => {
    //resets select
    $scope.material()
    //sets selects new values
    let values = Object.keys(tables[`${selected}`])
    FJScope[`fields${index}`] = values
  }

  //adds parameter to searchParams obj
  const addParam = () => FJScope.searchParams.push({})

  //create new parameter and display
  FJScope.createParam = () => {
    if( paramsComplete().length === 0 ) {
      numberOfParams++
      addParam()
    } else {
      ToastFactory.toastReject('Please fill out all parameters!')
    }
  }

  const paramsComplete = () => {
    let paramsPass = FJScope.searchParams.reduce( (arr, param) => {
      //if Customer or Property require all inputs
      if (param.table === 'Customer' || param.table === 'Property') {
        if (param.table && param.objToFind && param.objToFind.match) {
          return arr
        } else {
          arr.push('err')
          return arr
        }
      //else only require first two inputs  
      } else if (param.table && param.objToFind && param.objToFind.column !== null) {
        return arr
      } else {
        arr.push('err')
        return arr
      }
    }, [])
    return paramsPass 
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

  FJScope.submit = () => {
    if( paramsComplete().length === 0 ) {
      sendToDB() 
    } else {
      ToastFactory.toastReject('Please fill out all parameters!')
    }
  }

  const sendToDB = () => {
    Promise.all( 
      FJScope.searchParams.map( obj => {
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
      let { length } = data.filter( arr => arr.length > 0 )
      if (length === 0){
        ToastFactory.toastReject('Oooops! No matches found')
        FJScope.searchParams = []
        addParam()
      } else {
        FindJobService.setMatches(data).then( () => $rootScope.$apply( () => $location.path('/jobs/')))
      }  
    })
    .catch( err => console.log('err', err))
  }

  //initiate first parameter
  addParam()
})