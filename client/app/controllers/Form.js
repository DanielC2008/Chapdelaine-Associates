'use strict'

app.controller('Form', function($scope, $mdDialog, table, ids, JobFactory, FormFactory, editable, edit) {
  let FORM = this
  FORM.Display = {}

  if (!edit && !editable) {
    FORM.addNew = true
  } else if (!edit && editable) {
    FORM.addExisting = true
  } else if (edit && editable) {
    FORM.editExisting = true
  }

  switch(table) {
    case 'Clients':
      FORM.title = edit ? 'Update Client' : 'Add New Client'
      FORM.Display.Clients = FormFactory.getClientForm(editable)
      FORM.clientType = editable ? editable.client_type : null
      FORM.main = editable ? editable.main : null
      break;
    case 'Representatives':
      FORM.title = edit ? 'Update Representatives' : 'Add New Representatives'
      FORM.Display.Representatives = FormFactory.getRepForm(editable)
      FORM.client_id = ids.client_id
      break;
    case 'Properties':
      FORM.title = edit ? 'Update Property' : 'Add New Property'
      FORM.Display.Properties = FormFactory.getPropertyForm(editable)
      break;
  }

  FORM.table = table

  FORM.addNewToJob = ()  => {
    let dbObj = JobFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
      if (dbPackage) {
      JobFactory.addNewToJob(dbPackage)
      .then( ({data: msg}) => $mdDialog.hide(msg))
      .catch( ({data: msg}) => {
        if (msg) { //------------------------client entered incorrect data type
          JobFactory.toastReject(msg)
        } else { //--------------------------database err
          JobFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
        }
      })
    }
  }


  FORM.addExistingToJob = () => {
    let dbObj = JobFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    JobFactory.addExistingToJob(dbPackage)
    .then( ({data: msg}) => $mdDialog.hide(msg))
    .catch( ({data: msg}) => {
      if (msg) { //------------------------client entered incorrect data type
        JobFactory.toastReject(msg)
      } else { //--------------------------database err
        JobFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
      }
    })
  }


  FORM.updateExisting = () => {
    let dbObj = JobFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    JobFactory.updateExisting(dbPackage)
    .then( ({data: msg}) => $mdDialog.hide(msg))
    .catch( ({data: msg}) => {
      if (msg) { //------------------------client entered incorrect data type
        JobFactory.toastReject(msg)
      } else { //--------------------------database err
        JobFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
      }
    })
  }

  FORM.reject = () => $mdDialog.cancel({msg: 'Nothing Saved!'})


  const prepForDB = dbObj => {
    let dbPackage = {}
    if (table === 'Clients') {
      dbObj.client_type = FORM.clientType
      dbObj.main = FORM.main
      dbPackage.dbObj = dbObj
      dbPackage.ids = editable ? {job_id: ids.job_id, client_id: editable.client_id} : {job_id: ids.job_id}
      dbPackage.table = table
      return dbPackage
    } else if (table === 'Representatives') {
      dbPackage.table = table
      dbPackage.dbObj = dbObj
      dbPackage.ids = editable ? {representative_id: ids.rep_id} : {job_id: ids.job_id, client_id: ids.client_id}
      return dbPackage
    } else if (table === 'Properties') {
      if (!dbObj.primary_address && !dbObj.primary_road) {
        JobFactory.toastReject("Please enter an Address or a Road.")
      } else {
        dbPackage.dbObj = dbObj
        dbPackage.table = table
        dbPackage.ids = editable ? {job_id: ids.job_id, property_id: ids.property_id} : {job_id: ids.job_id}
        return dbPackage
      }   
    }
  }






})

