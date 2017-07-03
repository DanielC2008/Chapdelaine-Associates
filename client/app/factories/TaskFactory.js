'use strict'

app.factory('TaskFactory', function($q, $http, FormFactory) {
  let taskObj 
  let _initialized = $q.defer() //wait for data to return
  const factory = {}

  factory.getTaskNames = () => taskObj

  factory.getAllTasks = () => $http.get('/api/getAllTasks')

  factory.addNew = () => {
    return new Promise ((resolve, reject) => {
      FormFactory.updateForm('Tasks', null, {}, 'Add New').then( msg => resolve(msg)).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.updateExisting = (ids, task) => $http.post('/api/updateTask', {ids, task})

  // factory.deleteEmployee = id => $http.post('/api/deleteEmployee', {id})

  factory.getAllTasks()
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