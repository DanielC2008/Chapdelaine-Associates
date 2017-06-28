'use strict'

app.controller('Admin_Employees', function($scope, UserFactory, ToastFactory, $route) {
  const AE = this

  UserFactory.getAllEmployees().then( ({data}) => AE.Employees = data)

  AE.addNew = () => {
    UserFactory.addNew().then( ({msg}) => {
      UserFactory.setTab('AE')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.viewOrEdit = employee => {
    let ids = {employee_id: employee.employee_id}
    UserFactory.updateExisting(employee, ids).then( ({msg}) => {
      UserFactory.setTab('AE')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.delete = id => {
    UserFactory.deleteEmployee(id).then( ({msg}) => {
      UserFactory.setTab('AE')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }
    
  AE.changeStatus = () => console.log('status')

})