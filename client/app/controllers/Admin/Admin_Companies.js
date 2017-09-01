'use strict'

app.controller('Admin_Companies', function($scope, CompanyFactory, AlertFactory, FormFactory) {
  const ACO = this

  ACO.addOrEdit = () => { 
    let ids = {}
    CompanyFactory.searchForCompanies().then( company => {
      if (company) {
        ids.company_id = company.id
        CompanyFactory.getFullCompanyById(ids).then( ({data}) => {
          FormFactory.updateForm('Companies', data, ids, 'Update').then( ({dbPackage}) => {
            CompanyFactory.updateExisting(dbPackage).then( () => AlertFactory.toastSuccess()
            ).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        FormFactory.updateForm('Companies', null, {}, 'Add New').then( ({dbPackage}) => {
          CompanyFactory.addNew(dbPackage).then( () => AlertFactory.toastSuccess()
          ).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? AlertFactory.toastReject(err.msg) : console.log('err', err))
  } 


})