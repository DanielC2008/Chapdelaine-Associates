'use strict'

app.controller('Admin_Companies', function($scope, CompanyFactory, ToastFactory) {
  const ACO = this


  ACO.addOrEdit = () => { 
    let ids = {}
    CompanyFactory.searchForCompanies().then( company_id => {
      ids.company_id = company_id
      if (company_id) {
        CompanyFactory.getFullCompanyById({ids}).then( ({data}) => {
          CompanyFactory.updateExistingCompany(ids, data).then( ({msg}) => {
            ToastFactory.toastSuccess(msg)
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        // CompanyFactory.addNewCompany(ids).then( ({msg}) => {
        //   ToastFactory.toastSuccess(msg)
        // }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 


})