'use strict'

app.controller('AddNew', function($scope, $mdDialog, table, job_id, clientArray, JobFactory) {
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


  NEW.Display = {
    Clients: {
      'First Name': '', 
      'Middle Name': '', 
      'Last Name': '', 
      'Email': '', 
      'Business Phone': '', 
      'Mobile Phone': '', 
      'Home Phone': '', 
      'Fax Number': '', 
      'Address': '', 
      'City': '', 
      'State': '', 
      'Zip Code': '', 
      'County': '', 
      'Notes': '', 
    }, 
    Representatives: {
      'First Name': '', 
      'Middle Name': '', 
      'Last Name': '', 
      'Email': '', 
      'Business Phone': '', 
      'Mobile Phone': '', 
      'Home Phone': '', 
      'Fax Number': '', 
      'Address': '', 
      'City': '', 
      'State': '', 
      'Zip Code': '', 
      'County': '', 
      'Notes': '', 
    }, 
    Properties: {
      'Address': '',
      'City': '',
      'State': '',
      'Zip Code': '',
      'County': '',
      'Map': '',
      'Parcel Number': '',
      'Plat Book': '',
      'Plat Page': '',
      'Deed Book': '',
      'Deed Page': '',
      'Sub Division': '',
      'Notes': ''
    }
  }

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

