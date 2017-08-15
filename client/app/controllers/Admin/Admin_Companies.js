'use strict'

app.controller('Admin_Companies', function($scope, CompanyFactory, ToastFactory, DBFactory) {
  const ACO = this

  ACO.addOrEdit = () => { 
    let ids = {}
    CompanyFactory.searchForCompanies().then( company => {
      if (company) {
        ids.company_id = company.id
        CompanyFactory.getFullCompanyById(ids).then( ({data}) => {
          CompanyFactory.updateExistingCompany(ids, data).then( ({dbPackage}) => {
            DBFactory.updateExisting(dbPackage).then( () => ToastFactory.toastSuccess()
            ).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        CompanyFactory.addNewCompany().then( ({dbPackage}) => {
          DBFactory.addNew(dbPackage).then( () => ToastFactory.toastSuccess()
          ).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 


})