'use strict'

app.controller('AddNew', function($scope, $mdDialog, table, job_id, clientArray, JobFactory, FormFactory) {
  let NEW = this
  NEW.Display = {}

  switch(table) {
    case 'Clients':
      NEW.title = 'Client'
      NEW.Display.Clients = FormFactory.getClientForm()
      break;
    case 'Representatives':
      NEW.title = 'Representative'
      NEW.Display.Representatives = FormFactory.getRepresentativeForm()
      NEW.ClientNames = clientArray
      break;
    case 'Properties':
      NEW.title = 'Property'
      NEW.Display.Properties = FormFactory.getPropertyForm()
      break;
  }

  NEW.table = table

  NEW.send = ()  => {
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(NEW.Display[`${NEW.table}`]))
    let dataObj = {
      table,
      objToAdd,
      job_id
    }

    if(table === 'Representatives') {
      dataObj.client_id = NEW.clientId
    }

    if(table === 'Clients') {
      objToAdd.client_type = NEW.clientType
      objToAdd.main = NEW.main
    }

    JobFactory.addNewToJob(dataObj)
      .then( ({data: msg}) => {
        $mdDialog.hide(msg)
        for( let key in NEW.Display[`${NEW.table}`]) {
          NEW.Display[`${NEW.table}`][key] = ''
        }
      })
      .catch( ({data: msg}) => {
        if (msg) { //------------------------client entered incorrect data type
          JobFactory.toastReject(msg)
        } else { //--------------------------database err
          JobFactory.toastReject({msg: `Error: ${NEW.title} not saved!`})
        }
      })
  }

  NEW.reject = () => {
    $mdDialog.cancel({msg: 'Nothing Saved!'})
  }


})

