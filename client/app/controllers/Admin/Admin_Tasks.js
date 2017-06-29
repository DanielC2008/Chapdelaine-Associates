'use strict'

app.controller('Admin_Tasks', function($scope, TaskFactory, AdminFactory, ToastFactory, $route) {
  const AT = this

  AT.editIndex = false
  let original = undefined
  const removeChanges = () => AT.Tasks[`${AT.editIndex}`] = original

  AT.edit = (task, index) => {
    if (original !== undefined) {
      removeChanges()      
    }
    original =  Object.assign({}, task)
    AT.editIndex = index  
    console.log('original', original)
    console.log('AT', AT.Tasks[`${AT.editIndex}`])
  }

  AT.undoChanges = index => {
    console.log('original', original)
    console.log('AT', AT.Tasks[`${AT.editIndex}`])
    removeChanges()
    AT.editIndex = false
    original = undefined
  }  

  TaskFactory.getAllTasks().then( ({data}) => AT.Tasks = data )

  AT.addNew = () => {
    TaskFactory.addNew().then( ({msg}) => {
      AdminFactory.setTab('AT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AT.updateExisting = task => {

  }

  AT.addOnClick = event => {
    console.log('event', event)
  }




})