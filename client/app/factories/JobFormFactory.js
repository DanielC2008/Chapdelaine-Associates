'use strict'

app.factory('JobFormFactory', function($http) {

  const factory = {}

   const defaultJob = {
    jobInfo: {
      job_status: 'New',
      job_number: null,
      job_type: null
    },
    property: {
      primary_address: 'yooo'
    },
    addresses : [],
    roads: [],
    client: {},
    clientType: {},
    clientContact: {},
    owner: {},
    ownerContact: {},
    ids: {}
  }

  const newJob = {
    jobInfo: {
      job_status: 'Pending',
      job_number: -118,
      job_type: 'Pin'
    },
    property: {
      primary_address: 'ooop'
    },
    addresses : [],
    roads: [],
    client: {
      first_name: 'Dan',
      last_name: 'odddd',
    },
    clientType: {
      client_type: 'Owner'
    },
    clientContact: {},
    owner: {},
    ownerContact: {
      first_name: 'willy'
    },
    ids: {}
  }

  factory.createJob = (original, update) => {
    //function to check if items on a job were changed -- this can be used by the update function as well
    getChanges(original, update).then( data => {
      //returns a new obj that needs to be sent to the db
      const dbPackage = data      
    // db function
        //add new Prop, Client, (and if) CContact, Owner, OContact
          //if id exists send to update
          //if not send to add new
          //return ids
        //create Job and put all Ids + client *********dont do this with dummy data!************
        //send address and road arrays with Prop id
    })

  }

  const getChanges = (original, update) => {
    return new Promise( (resolve, reject) => {
      const dbPackage = {}
      for (let item in update) {
        const isEqual = _.isEqual(original[item], update[item])
        if (!isEqual) {
          dbPackage[`${item}`] = update[item]
        } 
      }
      resolve(dbPackage)
    })
  }


  factory.createJob(defaultJob, newJob)

  return factory
})