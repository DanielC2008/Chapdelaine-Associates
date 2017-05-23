'use strict'

app.factory('TableAndColumnFactory', function(JobFactory, $q) {
  let factory = {}
  let tableAndColumnObj 
  let _initialized = $q.defer() //wait for data to return


  JobFactory.getTypesOfWork()
    .then( ({data}) => {
      let Types_Of_Work = data.reduce( (obj, type) => {
        obj[type.type_of_work] = ''
        return obj
      }, {}) 
      tableAndColumnObj = createObj(Types_Of_Work)   
      _initialized.resolve(true) //data has returned and obj is finished pass true to resolve
    })
    .catch( (data) => console.log(data))


  let createObj = Types_Of_Work => {
    return {
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
        'Client Type': '',
        'Notes': ''
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
        'Road': '',
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
        'Acres': '',
        'Notes': ''
      },
      Jobs: {
        'Job Number': '',
        'Job Status': '',
        'Invoice Number': '',
      },
      'Types Of Work': Types_Of_Work
    }
  }

  factory.getObj = () => {
    return tableAndColumnObj
  }

  factory.initialized = _initialized.promise

  return factory
})