'use strict'

app.controller('Admin_Employees', function($scope, UserFactory, AdminFactory, ToastFactory, $route, DBFactory) {
  const AE = this

  UserFactory.getAllEmployees().then( ({data}) => AE.Employees = data)

  AE.addNew = () => {
    UserFactory.addNew().then( ({dbPackage}) => {
      DBFactory.addNew(dbPackage).then( () => {
        AdminFactory.setTab('AE')
        $route.reload()
        ToastFactory.toastSuccess()
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.viewOrEdit = employee => {
    let ids = {employee_id: employee.employee_id}
    UserFactory.updateExisting(employee, ids).then( ({dbPackage}) => {
      DBFactory.updateExisting(dbPackage).then( () => {
        AdminFactory.setTab('AE')
        $route.reload()
        ToastFactory.toastSuccess()
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.delete = id => {
    UserFactory.deleteEmployee(id).then( ({msg}) => {
      AdminFactory.setTab('AE')
      $route.reload()
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }
    
  AE.changeStatus = () => console.log('status')

})