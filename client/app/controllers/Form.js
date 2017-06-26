'use strict'

app.controller('Form', function($scope, $mdDialog, ToastFactory, FormFactory, DBFactory, table, ids, editable, edit) {
  let FORM = this

  FORM.Display = {}
  FORM.table = table

  if (!edit && !editable) {
    FORM.updateType = 'addNew'
  } else if (!edit && editable) {
    FORM.updateType = 'addExisting'
  } else if (edit && editable) {
    FORM.updateType = 'updateExisting'
  }

  switch(table) {
    case 'Clients':
      FORM.title = edit ? 'Update Client' : 'Add New Client'
      FORM.Display.Clients = FormFactory.getClientForm(editable)
      FORM.clientType = editable ? editable.client_type : null
      FORM.main = editable ? editable.main : null
      break;
    case 'Representatives':
      FORM.title = edit ? 'Update Representative' : 'Add New Representative'
      FORM.Display.Representatives = FormFactory.getRepForm(editable)
      FORM.client_id = ids.client_id
      break;
    case 'Properties':
      FORM.title = edit ? 'Update Property' : 'Add New Property'
      FORM.Display.Properties = FormFactory.getPropertyForm(editable)
      break;
  }

  FORM.addNew = ()  => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
      if (dbPackage) {
      DBFactory.addNew(dbPackage)
      .then( ({data: msg}) => $mdDialog.hide(msg))
      .catch( ({data: msg}) => {
        //if msg: client entered incorrect data type else database err
        msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
      })
    }
  }

  FORM.addExisting = () => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    DBFactory.addExisting(dbPackage)
    .then( ({data: msg}) => $mdDialog.hide(msg))
    .catch( ({data: msg}) => {
      //if msg: client entered incorrect data type else database err
      msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
    })
  }

  FORM.updateExisting = () => {
    let dbObj = FormFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    DBFactory.updateExisting(dbPackage)
    .then( ({data: msg}) => $mdDialog.hide(msg))
    .catch( ({data: msg}) => {
      //if msg: client entered incorrect data type else database err
      msg ? ToastFactory.toastReject(msg) : ToastFactory.toastReject({msg: `Error: ${FORM.title} not saved!`})
    })
  }

  FORM.reject = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

  const prepForDB = dbObj => { // can move this out to individual factories and return the prepped obj
    let dbPackage = {}
    if (table === 'Clients') {
      dbObj.client_type = FORM.clientType
      dbObj.main = FORM.main
      dbPackage.dbObj = dbObj
      dbPackage.ids = ids
      dbPackage.table = table
      return dbPackage
    } else if (table === 'Representatives') {
      dbPackage.table = table
      dbPackage.dbObj = dbObj
      dbPackage.ids = ids
      return dbPackage
    } else if (table === 'Properties') {
      if (!dbObj.primary_address && !dbObj.primary_road) {
        ToastFactory.toastReject("Please enter an Address or a Road.")
      } else {
        dbPackage.dbObj = dbObj
        dbPackage.table = table
        dbPackage.ids = ids
        return dbPackage
      }   
    }
  }

})

