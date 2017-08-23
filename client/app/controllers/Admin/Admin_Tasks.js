'use strict'

app.controller('Admin_Tasks', function($scope, TaskFactory, ToastFactory, FormFactory ) {
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
    FormFactory.updateForm('Tasks', null, {}, 'Add New').then( ({dbPackage}) => {
      TaskFactory.addNew(dbPackage).then( () => {
        $scope.setTabAndReload('AT')
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AT.saveChanges = task => {
    const ids = {task_id: task.task_id}
    delete task.task_id
    TaskFactory.updateExisting(task, ids).then( () => {
      $scope.setTabAndReload('AT')
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AT.disableTask = id => {
    TaskFactory.disableTask(id).then( ({data: {msg}}) => {
      $scope.setTabAndReload('AT')
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }  

})