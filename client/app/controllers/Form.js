'use strict'

app.controller('Form', function($scope, $mdDialog, table, job_id, clientArray, JobFactory, FormFactory, editable) {
  let FORM = this
  FORM.Display = {}

  switch(table) {
    case 'Clients':
      FORM.title = 'Client'
      FORM.Display.Clients = editable ? FormFactory.toClientForm(editable) : FormFactory.getClientForm()
      FORM.clientType = editable ? editable.client_type : null
      FORM.main = editable ? editable.main : null
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
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(FORM.Display[`${FORM.table}`]))
    let dataObj = {
      table,
      objToAdd,
      job_id
    }

    if(table === 'Representatives') {
      dataObj.client_id = FORM.clientId
    }

    if(table === 'Clients') {
      objToAdd.client_type = FORM.clientType
      objToAdd.main = FORM.main
    }

    if(table === 'Properties') {
      if (objToAdd.address === '' && objToAdd.road === '') {
        JobFactory.toastReject("Please enter an Address or a Road.")
        return
      }
    }
    JobFactory.addNewToJob(dataObj)
      .then( ({data: msg}) => {
        $mdDialog.hide(msg)
        for( let key in FORM.Display[`${FORM.table}`]) {
          FORM.Display[`${FORM.table}`][key] = ''
        }
      })
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


})

