'use strict'

app.controller('Admin_Employees', function($scope, UserFactory) {
  let AE = this

  UserFactory.getAllEmployees().then( ({data}) => AE.Employees = data)

  AE.addNew = () => console.log('addNew')
  AE.viewOrEdit = () => console.log('view')
  AE.delete = () => console.log('delete')
  AE.changeStatus = () => console.log('status')
})