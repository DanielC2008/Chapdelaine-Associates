'use strict'

app.controller('Form', function($scope, $mdDialog, ToastFactory, FormFactory, DBFactory, table, ids, existingObj, formType) {
  let FORM = this

  FORM.Display = {}
  FORM.table = table
  FORM.jobIdExists = ids.job_id ? true : false
  FORM.formType = formType

  switch(table) {
    case 'Customers':
      FORM.title = `${formType} Customer`
      FORM.Display.Customers = FormFactory.getCustomerForm(existingObj)
      break;
    case 'Properties':
      FORM.title = `${formType} Property`
      FORM.Display.Properties = FormFactory.getPropertyForm(existingObj)
      break;
    case 'Employees':
      FORM.title = `${formType} Employee`
      FORM.Display.Employees = FormFactory.getEmployeeForm(existingObj)
      break;
    case 'Tasks':
      FORM.title = `${formType} Task`
      FORM.Display.Tasks = FormFactory.getTaskForm() //can only update objs from admin page
      break;
    case 'Job_Types':
      FORM.title = `${formType} Job Type`
      FORM.Display.Job_Types = FormFactory.getJobTypeForm() 
      break;
    case 'Companies':
      FORM.title = `${formType} Company`
      FORM.Display.Companies = FormFactory.getCompanyForm(existingObj) 
      break;
    case 'Cancellations':
      FORM.title = `${formType} Cause For Cancellation`
      FORM.Display.Cancellations = FormFactory.getCauseForm() 
      break;
    case 'Addresses':
      FORM.title = `${formType} Address`
      FORM.Display.Addresses = FormFactory.getAddressForm() 
      break;
    case 'Roads':
      FORM.title = `${formType} Road`
      FORM.Display.Roads = FormFactory.getRoadForm() 
      break;
  }

  FORM.validate = () => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    if (dbPackage) {
    console.log('dbPackage', dbPackage)
      DBFactory.validate(dbPackage)
      .then( ({data: {msg}}) => $mdDialog.hide({dbPackage, msg}))
      .catch( ({data: {msg}}) => ToastFactory.toastReject(msg))
    }
  }

  FORM.reject = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

  const prepForDB = dbObj => {
    let dbPackage = {
      dbObj: dbObj,
      table: table,
      ids
    }

    if (table === 'Properties') {
      if (!dbObj.primary_address && !dbObj.primary_road) {
        ToastFactory.toastReject("Please enter an Address or a Road.")
      } else {
        return dbPackage
      }   
    } 

    else {
      return dbPackage   
    }
  }
  // FORM.addNew = ()  => {
  //   let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
  //   let dbPackage = prepForDB(dbObj)
  //     if (dbPackage) {
  //     DBFactory.addNew(dbPackage)
  //     .then( ({data: {msg}}) => $mdDialog.hide(msg))
  //     .catch( ({data: {msg}}) => {
  //       //if msg: client entered incorrect data type else database err
  //       msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
  //     })
  //   }
  // }

  // FORM.addExisting = () => {
  //   let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
  //   let dbPackage = prepForDB(dbObj)
  //   DBFactory.addExisting(dbPackage)
  //   .then( ({data: {msg}}) => $mdDialog.hide(msg))
  //   .catch( ({data: {msg}}) => {
  //     //if msg: client entered incorrect data type else database err
  //     msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
  //   })
  // }

  // FORM.updateExisting = () => {
  //   let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
  //   let dbPackage = prepForDB(dbObj)
  //   DBFactory.updateExisting(dbPackage)
  //   .then( ({data: {msg}}) => $mdDialog.hide(msg))
  //   .catch( ({data: {msg}}) => {
  //     //if msg: client entered incorrect data type else database err
  //     msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
  //   })
  // }


})

