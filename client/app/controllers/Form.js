'use strict'

app.controller('Form', function($scope, $mdDialog, ToastFactory, FormFactory, DBFactory, table, ids, existingObj, formType) {
  let FORM = this

  FORM.Display = {}
  FORM.table = table
  FORM.jobIdExists = ids.job_id ? true : false
  FORM.formType = formType

  switch(table) {
    case 'Clients':
      FORM.title = `${formType} Client`
      FORM.Display.Clients = FormFactory.getClientForm(existingObj)
      FORM.clientType = existingObj ? existingObj.client_type : null
      FORM.main = existingObj ? existingObj.main : null
      break;
    case 'Representatives':
      FORM.title = `${formType} Representative`
      FORM.Display.Representatives = FormFactory.getRepForm(existingObj)
      FORM.client_id = ids.client_id
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
  }

  FORM.addNew = ()  => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
      if (dbPackage) {
      DBFactory.addNew(dbPackage)
      .then( ({data: {msg}}) => $mdDialog.hide(msg))
      .catch( ({data: {msg}}) => {
        //if msg: client entered incorrect data type else database err
        msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
      })
    }
  }

  FORM.addExisting = () => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    DBFactory.addExisting(dbPackage)
    .then( ({data: {msg}}) => $mdDialog.hide(msg))
    .catch( ({data: {msg}}) => {
      //if msg: client entered incorrect data type else database err
      msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
    })
  }

  FORM.updateExisting = () => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    DBFactory.updateExisting(dbPackage)
    .then( ({data: {msg}}) => $mdDialog.hide(msg))
    .catch( ({data: {msg}}) => {
      //if msg: client entered incorrect data type else database err
      msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
    })
  }

  FORM.reject = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

  const prepForDB = dbObj => { // can move this out to individual factories and return the prepped obj
    let dbPackage = {
      dbObj: dbObj,
      ids: ids,
      table: table
    }

    if (table === 'Clients') {
      dbPackage.dbObj.client_type = FORM.clientType
      dbPackage.dbObj.main = FORM.main
      return dbPackage
    }

    else if (table === 'Properties') {
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

})

