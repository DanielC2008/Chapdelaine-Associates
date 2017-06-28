'use strict'

app.controller('Admin_Employees', function($scope, UserFactory, ToastFactory) {
  let AE = this

  UserFactory.getAllEmployees().then( ({data}) => AE.Employees = data)

  AE.addNew = () => {
    UserFactory.addNew().then( ({msg}) => {
      ToastFactory.toastSuccess(msg)
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.viewOrEdit = () => console.log('view')
  AE.delete = () => console.log('delete')
  AE.changeStatus = () => console.log('status')
})