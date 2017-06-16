'use strict'

app.controller('Form', function($scope, $mdDialog, table, job_id, clientArray, JobFactory, FormFactory, editable) {
  let FORM = this
  FORM.Display = {}

  switch(table) {
    case 'Clients':
      FORM.title = editable ? 'Update Client' : 'Add New Client'
      FORM.Display.Clients = editable ? FormFactory.toClientForm(editable) : FormFactory.getClientForm()
      FORM.clientType = editable ? editable.client_type : null
      FORM.main = editable ? editable.main : null
      FORM.edit = editable ? true : false
      break;
    case 'Representatives':
      FORM.title = 'Representative'
      FORM.Display.Representatives = FormFactory.getRepresentativeForm()
      FORM.ClientNames = clientArray
      break;
    case 'Properties':
      FORM.title = 'Property'
      FORM.Display.Properties = FormFactory.getPropertyForm()
      break;
  }

  FORM.table = table

  FORM.send = ()  => {
    let dbObj = JobFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
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

  FORM.reject = () => {
    $mdDialog.cancel({msg: 'Nothing Saved!'})
  }

  FORM.update = () => {
    let dbObj = JobFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dbPackage = prepForDB(dbObj)
    JobFactory.updateClient(dbPackage)
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
      dbPackage.idsArr = editable ? [{client_id: editable.client_id}, {job_id: job_id}] : [{job_id: job_id}]
      dbPackage.table = table
    } else if (table === 'Properties') {
      if (!dbObj.address && !dbObj.road) {
        JobFactory.toastReject("Please enter an Address or a Road.")
      }   
    }
    return dbPackage
  }






})

