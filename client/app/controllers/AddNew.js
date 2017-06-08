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
      break;
    case 'Properties':
      NEW.title = 'Property'
      NEW.Display.Properties = FormFactory.getPropertyForm()
      break;
  }

  NEW.table = table

  if (clientArray) {
    NEW.ClientNames = clientArray
  }

  NEW.send = ()  => {
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(NEW.Display[`${NEW.table}`]))
    let dataObj = {
      table,
      objToAdd,
      job_id
    }

    if(NEW.clientId) {
      dataObj.client_id = NEW.clientId
    }

    JobFactory.addNewToJob(dataObj)
      .then( ({data: msg}) => {
        $mdDialog.hide(msg)
        for( let key in NEW.Display[`${NEW.table}`]) {
          NEW.Display[`${NEW.table}`][key] = ''
        }
      })
      .catch( () => JobFactory.toastReject({msg: `Error: ${NEW.title} not saved!`}))
  }

  NEW.reject = () => {
    $mdDialog.cancel({msg: 'Nothing Saved!'})
  }


})

