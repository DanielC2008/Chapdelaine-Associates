'use strict'

app.controller('Admin_Tasks', function($scope, TaskFactory, AdminFactory, ToastFactory, $route) {
  const AT = this

  AT.edit = false

  AT.switch  = () => {
    AT.edit === false ? AT.edit = true : AT.edit = false  
  }

  TaskFactory.getAllTasks().then( ({data}) => AT.Tasks = data )

  AT.addNew = () => {
    TaskFactory.addNew().then( ({msg}) => {
      AdminFactory.setTab('AT')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }
})