'use strict'

app.controller('Admin_Customers', function($scope, CustomerFactory, ToastFactory, DBFactory) {
  let AC = this

  AC.addOrEdit = () => { 
    CustomerFactory.searchForCustomers().then( selected => {
      let customer_id = selected ? selected.id : null
      if (customer_id) {
        //if exist bring back full client in case they want to make changes
        CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
          //edit, validate, and on return set obj, clientSet, and id
          CustomerFactory.editCustomer(data, data.customer_id).then( ({dbPackage}) => {
            //send to edit
            dbPackage.customer_id = dbPackage.ids.customer_id
            DBFactory.updateExisting(dbPackage).then( () => ToastFactory.toastSuccess()).catch( err => console.log(err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
        CustomerFactory.addCustomer().then( ({dbPackage}) => {
          //send to add
          DBFactory.addNew(dbPackage).then( () => ToastFactory.toastSuccess()).catch( err => console.log(err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 

})