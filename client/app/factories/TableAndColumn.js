'use strict'

app.factory('TableAndColumnFactory', function(JobFactory) {

  JobFactory.getTypesOfWork()
    .then( ({data}) => {
      let Types_Of_Work = data.reduce( (obj, type) => {
        obj[type.type_of_work] = ''
        return obj
      }, {})
      tableAndColumn['Types Of Work'] = Types_Of_Work
    })
    .catch( (data) => console.log(data))

  const tableAndColumn = {
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
    },
    Jobs: {
      'Job Number': '',
      'Job Status': '',
      'Invoice Number': '',
      'Estimate Number': ''
    }
  }

  return tableAndColumn
})