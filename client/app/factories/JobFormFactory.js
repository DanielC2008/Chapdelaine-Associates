'use strict'

app.factory('JobFormFactory', function(DBFactory, $mdDialog, JobTypeFactory) {

  const factory = {}

   const defaultJob = {
    job_info: {
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
    client_type: {},
    client_contact: {},
    owner: {},
    owner_contact: {},
    ids: {}
  }

  const newJob = {
    job_info: {
      job_status: 'Pending',
      job_number: -118,
      job_type: 'Pin'
    },
    property: {
      primary_address: 'ooop'
    },
    addresses : [],
    roads: ['1223 smelly rd', '144 cashmoney st.'],
    client: {
      first_name: 'Dan',
      last_name: 'odddd',
    },
    client_type: {
      client_type: 'Owner'
    },
    client_contact: {},
    owner: {},
    owner_contact: {
      first_name: 'willy'
    },
    ids: {
      owner_contact_id: 123
    }
  }

  factory.updateJob = (original, update) => {
    let jobNumber = null
    let jobId = null
    const job_info = changed(original, update, 'job_info')
    const property = changed(original, update, 'property') 
    const client = changed(original, update, 'client') 
    const client_type = changed(original, update, 'client_type') 
    const client_contact = changed(original, update, 'client_contact') 
    const owner = changed(original, update, 'owner') 
    const owner_contact = changed(original, update, 'owner_contact')
    const ids = changed(original, update, 'ids') ? changed(original, update, 'ids') : {}
    const newAddresses = findAdditions(original.addresses, update.addresses)
    const removedAddresses = findRemovals(original.addresses, update.addresses) 
    const newRoads = findAdditions(original.roads, update.roads)
    const removedRoads = findRemovals(original.roads, update.roads) 
    const newJobTypes = findAdditions(original.job_types, update.job_types)
    const removedJobTypes = findRemovals(original.job_types, update.job_types)

    console.log('client', client)


    //if job_info changed send
    //if property changed send
    //if ids have changed remove (id: null)/update to new ids
    //if client_type changed to owner 
      //remove owner and owner rep
    // to buyer just change in db
    //if client changed and id changed
      // update new id only
    //else if only client changed
      // send update to curr
    //if client_contact and id
      // update new id only
    //else if only client changed
      // send
    //if owner changed and id
      // update new id only
    //else if only client changed
      // send
    //if owner_contact and id
      // update new id only
    //else if only client changed
      // send

  }  

  factory.createJob = (original, update) => {
    let jobNumber = null
    let jobId = null
    //function to check if items on a job were changed -- this can be used by the update function as well
    const job_info = changed(original, update, 'job_info')
    const property = changed(original, update, 'property') 
    const client = changed(original, update, 'client') 
    const client_type = changed(original, update, 'client_type') 
    const client_contact = changed(original, update, 'client_contact') 
    const owner = changed(original, update, 'owner') 
    const owner_contact = changed(original, update, 'owner_contact')
    const ids = changed(original, update, 'ids') ? changed(original, update, 'ids') : {}
    const newAddresses = findAdditions(original.addresses, update.addresses)
    const newRoads = findAdditions(original.roads, update.roads)
    const newJobTypes = findAdditions(original.job_types, update.job_types)
  
    //one array to add new and one to update existing customers
    const customersToAdd = []
    const customersToUpdate = []
    if (client) {
      update.ids.client_id ? customersToUpdate.push({customer: client, id: update.ids.client_id}) : customersToAdd.push({customer: client, idType: 'client_id'})
    }
    if (client_contact) {
      update.ids.client_contact_id ? customersToUpdate.push({customer: client_contact, id: update.ids.client_contact_id}) : customersToAdd.push({customer: client_contact, idType: 'client_contact_id'})
    }
    if (owner) {
      update.ids.owner_id ? customersToUpdate.push({customer: owner, id: update.ids.owner_id}) : customersToAdd.push({customer: owner, idType: 'owner_id'})
    }
    if (owner_contact) {
      update.ids.owner_contact_id ? customersToUpdate.push({customer: owner_contact, id: update.ids.owner_contact_id}) : customersToAdd.push({customer: owner_contact, idType: 'owner_contact_id'})
    }
    //add new Prop, Client, (and if) C_Contact, Owner, O_Contact
    Promise.all([
      //addProp and add property_id to ids obj
      DBFactory.addNew({table: 'Properties', dbObj: property}).then( ({data}) => {
        ids.property_id = data.property_id
      }).catch( err => Promise.reject(err)),
      //if client exists send to update 
      updateExistingCustomers(customersToUpdate).then( data => {}).catch( err => Promise.reject(err)), 
      //if not send to add new
      addNewCustomers(customersToAdd).then( data => {
        //add new ids to id obj
        data.forEach( id => ids[`${Object.keys(id)[0]}`] = id[Object.keys(id)[0]])
      }).catch( err => Promise.reject(err))
    ]).then( () => {
      let jobObj = Object.assign({}, job_info, client_type, ids)
      Promise.all([
        //create Job and put all Ids + client
        DBFactory.addNew({table: 'Jobs', dbObj: jobObj}).then( ({data:{job_id, job_number}}) => {
          jobNumber = job_number
          jobId = job_id
        }).catch( err => Promise.reject(err)),
        //send address and road arrays with Prop id
        addAddressesToProp(newAddresses, ids.property_id).then().catch( err => Promise.reject(err)),
        addRoadsToProp(newRoads, ids.property_id).then().catch( err => Promise.reject(err))
      ]).then( () => {
        addJobTypesToJob(newJobTypes, jobId).then( () => {
          console.log('jobNumber', jobNumber)
          $mdDialog.hide(jobNumber)
        }).catch( err => console.log('err', err))
      }).catch( err => console.log('err', err))
    }).catch( err => console.log('err', err))

  }

  const changed = (o, u, key) => _.isEqual(o[`${key}`], u[`${key}`]) ? null : u[`${key}`] 

  const addNewCustomers = customersToAdd => {
    return new Promise( (resolve, reject) => {
      Promise.all(customersToAdd.map( customer => {
        let dbPackage = {table: 'Customers', dbObj: customer.customer, idType: customer.idType}
        return DBFactory.addNew(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const updateExistingCustomers = customersToUpdate => {
    return new Promise( (resolve, reject) => {
      Promise.all(customersToUpdate.map( customer => {
        let dbPackage = {table: 'Customers', dbObj: customer.customer, id: customer.id }
        return DBFactory.updateExisting(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const addAddressesToProp = (newAddresses, property_id) => {
    return new Promise( (resolve, reject) => {
      Promise.all(newAddresses.map( address => {
        let dbPackage = {table: 'Addresses', address: address, property_id: property_id}
        return DBFactory.addNew(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const addRoadsToProp = (newRoads, property_id) => {
    return new Promise( (resolve, reject) => {
      Promise.all(newRoads.map( road => {
        let dbPackage = {table: 'Roads', road: road, property_id: property_id}
        return DBFactory.addNew(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const addJobTypesToJob = (newJobTypes, jobId) => {
    return new Promise( (resolve, reject) => {
      Promise.all(newJobTypes.map( job_type => {
        let dbPackage = {job_type: job_type, job_id: jobId}
        return JobTypeFactory.addJobTypeToJob(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const findAdditions = (original, update) => {
    return update.reduce( (arr, type) => {
      if (!original.includes(type)) {
        arr.push(type)
      }
      return arr
    },[])
  } 

  const findRemovals = (original, update) => {
    return original.reduce( (arr, type) => {
      if (!update.includes(type)) {
        arr.push(type)
      }
      return arr
    },[])
  }  

  // factory.createJob(defaultJob, newJob)

  return factory
})