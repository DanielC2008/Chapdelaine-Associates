'use strict'

app.controller('AddNew', function($scope, $mdDialog, table, job_number, JobFactory, $route) {
  let NEW = this
  NEW.title = table

  NEW.Display = {
    Client: {
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
    Representative: {
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
    Property: {
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
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(NEW.Display[`${NEW.title}`]))
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

