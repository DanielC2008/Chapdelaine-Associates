'use strict'

app.factory('TableAndColumnFactory', function(JobFactory, $q) {
  let factory = {}
  let tableAndColumnObj 
  let _initialized = $q.defer() //wait for data to return


  JobFactory.getTasks()
    .then( ({data}) => {
      let Tasks = data.reduce( (obj, task) => {
        obj[task.task] = ''
        return obj
      }, {}) 
      tableAndColumnObj = createObj(Tasks)   
      _initialized.resolve(true) //data has returned and obj is finished pass true to resolve
    })
    .catch( (data) => console.log(data))


  let createObj = Tasks => {
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
      'Tasks': Tasks
    }
  }

  factory.getObj = () => {
    return tableAndColumnObj
  }

  factory.initialized = _initialized.promise

  return factory
})