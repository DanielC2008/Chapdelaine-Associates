'use strict'

app.controller('AddNewClient', function($scope, $mdDialog, table, job_number, JobFactory, $route) {
  let NEW = this

  NEW.table = table

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
    }
  }

  NEW.send = ()  => {
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(NEW.Display[`${table}`]))
    let dataObj = {
      table,
      objToAdd,
      job_number
    }
    JobFactory.addNewToJob(dataObj)
      .then( ({data}) => {
        $mdDialog.cancel()
        $route.reload()
      })
      .catch( ({data}) => console.log(data))
  }

  NEW.reject = () => {
    $mdDialog.cancel()
  }


})

