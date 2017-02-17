'use strict'

app.controller('AddNew', function($scope, $mdDialog, table, job_id, clientArray, JobFactory, TableAndColumnFactory) {
  let NEW = this

  switch(table) {
    case 'Clients':
      NEW.title = 'Client'
      break;
    case 'Representatives':
      NEW.title = 'Representative'
      break;
    case 'Properties':
      NEW.title = 'Property'
      break;
  }

  NEW.table = table

  if (clientArray) {
    NEW.ClientNames = clientArray
  }

  NEW.Display = TableAndColumnFactory

  NEW.send = ()  => {
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(NEW.Display[`${NEW.table}`]))
    let dataObj = {
      table,
      objToAdd,
      job_id
    }

    if(NEW.clientId) {
      dataObj.clientId = NEW.clientId
    }
    JobFactory.addNewToJob(dataObj)
      .then( () => $mdDialog.hide({msg: `${NEW.title} Saved!`}))
      .catch( () => JobFactory.toastReject({msg: `Error: ${NEW.title} not saved!`}))
  }

  NEW.reject = () => {
    $mdDialog.cancel({msg: 'Nothing Saved!'})
  }


})

