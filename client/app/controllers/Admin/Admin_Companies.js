'use strict'

app.controller('Admin_Companies', function($scope, CompanyFactory, ToastFactory, FormFactory) {
  const ACO = this

  ACO.addOrEdit = () => { 
    let ids = {}
    CompanyFactory.searchForCompanies().then( company => {
      if (company) {
        ids.company_id = company.id
        CompanyFactory.getFullCompanyById(ids).then( ({data}) => {
          FormFactory.updateForm('Companies', data, ids, 'Update').then( ({dbPackage}) => {
            CompanyFactory.updateExisting(dbPackage).then( () => ToastFactory.toastSuccess()
            ).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        FormFactory.updateForm('Companies', null, {}, 'Add New').then( ({dbPackage}) => {
          CompanyFactory.addNew(dbPackage).then( () => ToastFactory.toastSuccess()
          ).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 


})