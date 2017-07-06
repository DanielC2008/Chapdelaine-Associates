'use strict'

app.controller('Admin_Tasks', function($scope, TaskFactory, AdminFactory, ToastFactory, $route) {
  const AT = this
  AT.editIndex = false
  let original = undefined
  
  TaskFactory.getEnabledTasks().then( ({data}) => AT.Tasks = data )
  
  const removeChanges = () => AT.Tasks[`${AT.editIndex}`] = original
  
  AT.edit = (task, index) => {
    if (original !== undefined) {
      removeChanges()      
    }
    original =  Object.assign({}, task)
    AT.editIndex = index  
  }

  AT.undoChanges = index => {
    removeChanges()
    AT.editIndex = false
    original = undefined
  }  
  
  AT.addNew = () => {
    TaskFactory.addNew().then( ({msg}) => {
      AdminFactory.setTab('AT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AT.saveChanges = task => {
    const ids = {task_id: task.task_id}
    delete task.task_id
    TaskFactory.updateExisting(ids, task).then( ({data: {msg}}) => {
      AdminFactory.setTab('AT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AT.disableTask = id => {
    TaskFactory.disableTask(id).then( ({data: {msg}}) => {
      AdminFactory.setTab('AT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }  

})