'use strict'

app.controller('Admin_Customers', function($scope, CustomerFactory, ToastFactory, FormFactory) {
  const AC = this

  AC.addOrEdit = () => { 
    CustomerFactory.searchForCustomers().then( selected => {
      let customer_id = selected ? selected.id : null
      if (customer_id) {
        //if exist bring back full client in case they want to make changes
        CustomerFactory.getFullCustomerById({customer_id}).then( ({data}) => {
          //edit, validate, and on return set obj, clientSet, and id
          FormFactory.updateForm('Customers', data, {customer_id: customer_id}, 'Update').then( ({dbPackage}) => {
            //send to edit
            dbPackage.customer_id = dbPackage.ids.customer_id
            CustomerFactory.updateExisting(dbPackage).then( () => ToastFactory.toastSuccess()).catch( err => console.log(err))
          }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      } else {
         FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New').then( ({dbPackage}) => {
          //send to add
          CustomerFactory.addNew(dbPackage).then( () => ToastFactory.toastSuccess()).catch( err => console.log(err))
        }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
      }
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  } 

})