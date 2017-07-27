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
    ids: {
      owner_contact_id: 123
    }
  }

  factory.createJob = (original, update) => {
    //function to check if items on a job were changed -- this can be used by the update function as well
      const jobInfo = changed(original, update, 'jobInfo')
      const property = changed(original, update, 'property') 
      const addresses = changed(original, update, 'addresses') 
      const roads = changed(original, update, 'roads') 
      const client = changed(original, update, 'client') 
      const clientType = changed(original, update, 'clientType') 
      const clientContact = changed(original, update, 'clientContact') 
      const owner = changed(original, update, 'owner') 
      const ownerContact = changed(original, update, 'ownerContact')
      const ids = changed(original, update, 'ids') 
      //one array to add new and one to update existing customers
      const customersToAdd = []
      const customersToUpdate = []
      if (client) {
        update.ids.client_id ? customersToUpdate.push(client) : customersToAdd.push(client)
      }
      if (clientContact) {
        update.ids.client_contact_id ? customersToUpdate.push(clientContact) : customersToAdd.push(clientContact)
      }
      if (owner) {
        update.ids.owner_id ? customersToUpdate.push(owner) : customersToAdd.push(owner)
      }
      if (ownerContact) {
        update.ids.owner_contact_id ? customersToUpdate.push(ownerContact) : customersToAdd.push(ownerContact)
      }

      // // return new Promise.all([

      // ]).then 
    // db function
        //add new Prop, Client, (and if) CContact, Owner, OContact
          //if id exists send to update
          //if not send to add new
          //return ids
        //create Job and put all Ids + client *********dont do this with dummy data!************
        //send address and road arrays with Prop id
    // })

  }

  const changed = (o, u, key) => _.isEqual(o[`${key}`], u[`${key}`]) ? null : u[`${key}`] 

  factory.createJob(defaultJob, newJob)

  return factory
})