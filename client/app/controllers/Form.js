'use strict'

app.controller('Form', function($scope, $mdDialog, table, ids, JobFactory, FormFactory, editable) {
  let FORM = this
  FORM.Display = {}
  FORM.edit = editable ? true : false

  switch(table) {
    case 'Clients':
      FORM.title = editable ? 'Update Client' : 'Add New Client'
      FORM.Display.Clients = FormFactory.getClientForm(editable)
      FORM.clientType = editable ? editable.client_type : null
      FORM.main = editable ? editable.main : null
      break;
    case 'Representatives':
      FORM.title = editable ? 'Update Representatives' : 'Add New Representatives'
      FORM.Display.Representatives = FormFactory.getRepForm(editable)
      FORM.client_id = ids.client_id
      break;
    case 'Properties':
      FORM.title = editable ? 'Update Property' : 'Add New Property'
      FORM.Display.Properties = FormFactory.getPropertyForm(editable)
      break;
  }

  FORM.table = table

  FORM.send = ()  => {
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

  FORM.reject = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

  FORM.update = () => {
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
      if (!dbObj.address && !dbObj.road) {
        JobFactory.toastReject("Please enter an Address or a Road.")
      } else {
        dbPackage.dbObj = dbObj
        dbPackage.table = table
        dbPackage.ids = {job_id: ids.job_id}
        return dbPackage
      }   
    }
  }






})

