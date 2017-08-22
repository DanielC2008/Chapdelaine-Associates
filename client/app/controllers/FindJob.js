'use strict'

app.controller('FindJob', function($scope, $location, $rootScope, JobTypeFactory, TaskFactory, MatchService, FindJobFactory, FormFactory, ToastFactory, CustomerFactory, PropertyFactory) {
  
  const FJScope = this

  let numberOfParams = 1
  const tables = {}
  const propConnectTableColumns = ['address', 'road']
  const foreignKeyColumns = ['address', 'road', 'state', 'zip_code', 'city', 'county', 'company']
  //array of objs, each obj is a different param (table, column, user input)
  FJScope.searchParams = []

////////////////////////////////TABLE DATA////////////////////////////////
  //get table and column data then set to scope
  Promise.all([
    TaskFactory.getAllTasks().then( ({data}) => {
      return data.reduce( (obj, task) => {
        obj[task.task] = ''
        return obj
      }, {})
    }),
    JobTypeFactory.getAllJobTypes().then( ({data}) => {
      return data.reduce( (obj, type) => {
        obj[type.job_type] = ''
        return obj
      }, {})
    })
  ])
  .then( data => {
    tables.Customer = FindJobFactory.getCustomerForFindJob()
    tables.Property = FindJobFactory.getPropertyForFindJob()
    tables['Job Type'] = data[1]
    tables['Job Status'] = FindJobFactory.getJobStatusesForFindJob()
    tables.Task = data[0]
    FJScope.tables = Object.keys(tables)
    $scope.$apply()
  })
  .catch(err => console.log('err', err))

////////////////////////////////COLUMN DATA////////////////////////////////
  FJScope.columnSelected = (column, index) => {
    if (column === 'Name') {
      CustomerFactory.searchForCustomers().then( data => {
        FJScope.searchParams[index].match = data.value
        $scope.$apply()
      })
    }
    else if (column === 'Address') {
      PropertyFactory.searchForAddresses().then( data => {
        FJScope.searchParams[index].match = data.value
        $scope.$apply()
      })
    }
    else if (column === 'Road') {
      PropertyFactory.searchForRoads().then( data => {
        FJScope.searchParams[index].match = data.value
        $scope.$apply()
      })
    }
  }

  FJScope.getColumnValues = (selected, index) => {
    //resets select
    $scope.material()
    //sets selects new values
    let values = Object.keys(tables[`${selected}`])
    FJScope[`columns${index}`] = values
  }

////////////////////////////////INPUT DATA////////////////////////////////
  //determine if user can input should be disabled
  FJScope.noUserInput = index => {
    if (!FJScope.searchParams[index].table || 
        FJScope.searchParams[index].table === "Task" || 
        FJScope.searchParams[index].table === "Job Status" || 
        FJScope.searchParams[index].table === "Job Type" ||
        FJScope.searchParams[index].column === 'Name' ||
        FJScope.searchParams[index].column === 'Address' ||
        FJScope.searchParams[index].column === 'Road'
    ) {
      return true
    } else {
      return false
    }
  }

////////////////////////////////PARAMETER DATA////////////////////////////////  
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
        if (param.table && param.column && param.match) {
          return arr
        } else {
          arr.push('err')
          return arr
        }
      //else only require first two inputs  
      } else if (param.table && param.column !== null) {
        return arr
      } else {
        arr.push('err')
        return arr
      }
    }, [])
    return paramsPass 
  }

////////////////////////////////DATABASE HELPERS////////////////////////////////  
  const createObjToFind = obj => {
    const newObj = {}
    //if param required user input set column = match
    if (obj.match) {
      newObj[`${obj.column}`] = obj.match
      delete obj.match
    //set the table = column
    } else {
      newObj[`${obj.table}`] = obj.column
    }
    obj.objToFind = FormFactory.matchDatabaseKeys(newObj)
    delete obj.column
  }

  const separteName = obj => {
    const name = obj.objToFind.name
    const nameArr = name.split(' ')
    obj.objToFind = nameArr.reduce( (obj, name, index) => {
      if (index === 0) {
        obj.first_name = name
      } else if (index === 1) {
        obj.middle_name = name
      } else {
        obj.last_name = name
      }
      return obj
    },{})
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
    if (column === 'name'){
      obj.dbRelation = 'name'
    } else if (foreignKeyColumns.includes(column)){
      obj.dbRelation = 'foreignKey'
    } else {
      obj.dbRelation = 'regColumn'
    }
  }
  //cycles through each param, creates the objToFind and decides which route it should go to in the db
  const sendToDB = () => {
    Promise.all( 
      FJScope.searchParams.map( obj => {
        createObjToFind(obj)
        return new Promise( (resolve, reject) => {
          ////////////////////Jobs Status////////////////////
          if (obj.table === 'Job Status') {
            FindJobFactory.searchForJobStatus(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          }
          ////////////////////Jobs Type////////////////////
          if (obj.table === 'Job Type') {
            FindJobFactory.searchForJobType(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          } 
          ////////////////////Task////////////////////
          else if (obj.table === 'Task') {
            FindJobFactory.searchForTasks(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
          } 
          ////////////////////Property////////////////////
          else if (obj.table === 'Property') {
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
            getCustomerDBRelation(obj)
            if (obj.dbRelation === 'name'){
              separteName(obj)
              FindJobFactory.customerName(obj).then( ({data}) => resolve(data)).catch( err => Promise.reject(err))
            }
            else if (obj.dbRelation === 'connectTable') {
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
        MatchService.setMatches(data).then( () => $rootScope.$apply( () => $location.path('/jobs/')))
      }  
    })
    .catch( err => console.log('err', err))
  }

  //check if all params complete else toast reject to user
  FJScope.submit = () => paramsComplete().length === 0 ? sendToDB() : ToastFactory.toastReject('Please fill out all parameters!')

  //initiate first parameter
  addParam()
})