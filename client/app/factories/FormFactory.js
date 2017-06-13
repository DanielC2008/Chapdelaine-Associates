'use strict'

app.factory('FormFactory', function(JobFactory, $q) {
  let factory = {}
  let taskObj 
  let _initialized = $q.defer() //wait for data to return

  let createTasks = Tasks => {
    return {
      Tasks
    }
  }  

  JobFactory.getTasks()
    .then( ({data}) => {
      let Tasks = data.reduce( (obj, task) => {
        obj[task.task] = ''
        return obj
      }, {}) 
      taskObj = createTasks(Tasks)   
      _initialized.resolve(true) //data has returned and obj is finished pass true to resolve
    })
    .catch( (data) => console.log(data))

  factory.getClientForm = () => {
    return {
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
      'Notes': ''
    }
  }  

  factory.getRepresentativeForm = () => {
    return {
      'First Name': '', 
      'Middle Name': '', 
      'Last Name': '', 
      'Email': '', 
      'Business Phone': '', 
      'Mobile Phone': '', 
      'Home Phone': '', 
      'Fax Number': '',
      'Company Name': '',
      'Company Address': '', 
      'Address': '', 
      'City': '', 
      'State': '', 
      'Zip Code': '', 
      'County': '', 
      'Notes': ''
    }
  } 

  factory.getPropertyForm = () => {
    return {
      'Address': '',
      'Road': '',
      'City': '',
      'State': '',
      'Zip Code': '',
      'County': '',
      'Property Map': '',
      'Parcel Number': '',
      'Plat Book': '',
      'Plat Page': '',
      'Deed Book': '',
      'Deed Page': '',
      'Sub Division': '',
      'Lot Number': '',
      'Acres': null, 
      'Notes': ''
    }
  }   

  factory.getJobForm = () => {
    return {
      'Job Number': '',
      'Job Status': '',
      'Invoice Number': ''
    }
  }    

  factory.getTaskForm = () => {
    return taskObj
  }

  factory.initialized = _initialized.promise

  return factory
})