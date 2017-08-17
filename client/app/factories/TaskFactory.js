'use strict'

app.factory('TaskFactory', function($q, $http) {
  let taskObj 
  let _initialized = $q.defer() //wait for data to return
  const factory = {}

  factory.addNew = dbPackage => $http.post('/api/addNewTask', dbPackage)

  factory.updateExisting = (dbObj, ids) => $http.post('/api/updateTask', {dbObj, ids})

  factory.disableTask = id => $http.post('/api/disableTask', {id})

  factory.getTaskNames = () => taskObj

  factory.getEnabledTasks = () => $http.get('/api/getEnabledTasks')

  factory.getEnabledTasks()
  .then( ({data}) => {
    let Tasks = data.reduce( (obj, task) => {
      obj[task.task] = ''
      return obj
    }, {}) 
    taskObj = Tasks  
    _initialized.resolve(true) //data has returned and obj is finished pass true to resolve
  }).catch( (data) => console.log(data))

  factory.initialized = _initialized.promise

  return factory
})  