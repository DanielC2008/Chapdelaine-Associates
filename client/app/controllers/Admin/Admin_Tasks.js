'use strict'

app.controller('Admin_Tasks', function($scope, TaskFactory, ToastFactory, $route) {
  const AT = this

  AT.edit = false
  AT.switch  = () => {
    AT.edit === false ? AT.edit = true : AT.edit = false  
  }
  TaskFactory.getAllTasks().then( ({data}) => AT.Tasks = data)



  // AT.addNew = () => {
  //   UserFactory.addNew().then( ({msg}) => {
  //     UserFactory.setTab('AE')
  //     $route.reload()
  //     ToastFactory.toastSuccess(msg)
  //   }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  // }
})