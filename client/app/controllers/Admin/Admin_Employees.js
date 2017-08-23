'use strict'

app.controller('Admin_Employees', function($scope, UserFactory, ToastFactory, FormFactory) {
  const AE = this

  UserFactory.getAllEmployees().then( ({data}) => AE.Employees = data)

  AE.addNew = () => {
     FormFactory.updateForm('Employees', null, {employee_id: null}, 'Add New').then( ({dbPackage}) => {
      UserFactory.addNew(dbPackage).then( () => {
        $scope.setTabAndReload('AE')
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.viewOrEdit = employee => {
    let ids = {employee_id: employee.employee_id}
    FormFactory.updateForm('Employees', employee, ids, 'Update').then( ({dbPackage}) => {
      UserFactory.updateExisting(dbPackage).then( () => {
        $scope.setTabAndReload('AE')
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  AE.delete = id => {
    UserFactory.deleteEmployee(id).then( ({msg}) => {
      $scope.setTabAndReload('AE')
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }
    
  AE.changeStatus = () => console.log('status')

})