'use strict'

app.factory('JobFormFactory', function(DBFactory) {

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
        update.ids.client_id ? customersToUpdate.push({customer: client, id: update.ids.client_id}) : customersToAdd.push({customer: client, idType: 'client_id'})
      }
      if (clientContact) {
        update.ids.client_contact_id ? customersToUpdate.push({customer: clientContact, id: update.ids.client_contact_id}) : customersToAdd.push({customer: clientContact, idType: 'client_contact_id'})
      }
      if (owner) {
        update.ids.owner_id ? customersToUpdate.push({customer: owner, id: update.ids.owner_id}) : customersToAdd.push({customer: owner, idType: 'owner'})
      }
      if (ownerContact) {
        update.ids.owner_contact_id ? customersToUpdate.push({customer: ownerContact, id: update.ids.owner_contact_id}) : customersToAdd.push({customer: ownerContact, idType: 'owner_contact_id'})
      }
      //add new Prop, Client, (and if) C_Contact, Owner, O_Contact
      Promise.all([
        //addProp
        //if id exists send to update
        updateExistingCustomers(customersToUpdate).then( data => Promise.resolve(data)).catch( err => reject(err))
        //if not send to add new
        addNewCustomers(customersToAdd).then( data => Promise.resolve(data)).catch( err => reject(err)),
      ]).then( data => {
        //return ids
        
      })
    // db function
        //create Job and put all Ids + client *********dont do this with dummy data!************
        //send address and road arrays with Prop id
    // })

  }

  const changed = (o, u, key) => _.isEqual(o[`${key}`], u[`${key}`]) ? null : u[`${key}`] 

  const addNewCustomers = customersToAdd => {
    return new Promise( (resolve, reject) => {
      Promise.all(customersToAdd.map( customer => {
        let dbPackage = {table: 'Customers', dbObj: customer, idType: customer.idType}
        return DBFactory.addNew(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const updateExistingCustomers = customersToUpdate => {
    return new Promise( (resolve, reject) => {
      Promise.all(customersToUpdate.map( customer => {
        let dbPackage = {table: 'Customers', dbObj: customer.customer, id: customer.id }
        return DBFactory.updateExisting(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  factory.createJob(defaultJob, newJob)

  return factory
})