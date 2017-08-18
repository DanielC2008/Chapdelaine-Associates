'use strict'

app.factory('JobFormFactory', function($mdDialog, JobTypeFactory, CustomerFactory, PropertyFactory, JobFactory) {

  const factory = {}

  factory.updateJob = (original, update) => {
    const originalJobNumber = original.job_info.job_number
    const jobId = original.job_info.job_id
    const newJobNumber = update.job_info.job_number

    const job_info = findChanges(original.job_info, update.job_info)
    const property = findChanges(original.property, update.property) 
    const client = findChanges(original.client, update.client) 
    const client_type = findChanges(original.client_type, update.client_type) 
    const client_contact = findChanges(original.client_contact, update.client_contact) 
    const owner = findChanges(original.owner, update.owner) 
    const owner_contact = findChanges(original.owner_contact, update.owner_contact)
    const ids = findChanges(original.ids, update.ids)
    const newAddresses = findAdditions(original.addresses, update.addresses)
    const removedAddresses = findRemovals(original.addresses, update.addresses) 
    const newRoads = findAdditions(original.roads, update.roads)
    const removedRoads = findRemovals(original.roads, update.roads) 
    const newJobTypes = findAdditions(original.job_types, update.job_types)
    const removedJobTypes = findRemovals(original.job_types, update.job_types)

    const customersToAdd = []
    const customersToUpdate = []
    if (Object.keys(client).length > 0) {
      update.ids.client_id ? customersToUpdate.push({customer: client, id: update.ids.client_id}) : customersToAdd.push({customer: client, idType: 'client_id'})
    }
    if (Object.keys(client_contact).length > 0) {
      update.ids.client_contact_id ? customersToUpdate.push({customer: client_contact, id: update.ids.client_contact_id}) : customersToAdd.push({customer: client_contact, idType: 'client_contact_id'})
    }
    if (Object.keys(owner).length > 0) {
      update.ids.owner_id ? customersToUpdate.push({customer: owner, id: update.ids.owner_id}) : customersToAdd.push({customer: owner, idType: 'owner_id'})
    }
    if (Object.keys(owner_contact).length > 0) {
      update.ids.owner_contact_id ? customersToUpdate.push({customer: owner_contact, id: update.ids.owner_contact_id}) : customersToAdd.push({customer: owner_contact, idType: 'owner_contact_id'})
    }
    Promise.all([
      updateExistingCustomers(customersToUpdate).then( data => {}).catch( err => Promise.reject(err)), 
      addNewCustomers(customersToAdd).then( data => {
        //add new ids to id 
        data.forEach( id => ids[`${Object.keys(id)[0]}`] = id[Object.keys(id)[0]])
      }).catch( err => Promise.reject(err))

    ]).then( () => {
      let jobObj = Object.assign({}, job_info, client_type, ids)
      if (client_type.client_type === "Owner") {
        jobObj.owner_id = null
        jobObj.owner_contact_id = null
      }
      Promise.all([
        updateJob(jobObj, originalJobNumber).then().catch( err => Promise.reject(err)),
        updateProp(property, original.ids.property_id).then().catch( err => Promise.reject(err)),
        addSecondaryAddress(newAddresses, original.ids.property_id).then().catch( err => Promise.reject(err)),
        removeSecondaryAddress(removedAddresses, original.ids.property_id).then().catch( err => Promise.reject(err)),
        addSecondaryRoad(newRoads, original.ids.property_id).then().catch( err => Promise.reject(err)),
        removeSecondaryRoad(removedRoads, original.ids.property_id).then().catch( err => Promise.reject(err)),
        addJobTypesToJob(newJobTypes, jobId).then().catch( err => console.log('err', err)),
        removeJobTypesFromJob(removedJobTypes, jobId).then().catch( err => console.log('err', err))
      ]).then( () => {
        $mdDialog.hide(newJobNumber)
      }).catch( err => console.log('err', err))
    }).catch( err => console.log('err', err))
  }  

  factory.createJob = (original, update) => {

    let jobNumber = null
    let jobId = null
    //function to check if items on a job were changed -- this can be used by the update function as well
    const job_info = findChanges(original.job_info, update.job_info)
    const property = findChanges(original.property, update.property) 
    const client = findChanges(original.client, update.client) 
    const client_type = findChanges(original.client_type, update.client_type) 
    const client_contact = findChanges(original.client_contact, update.client_contact) 
    const owner = findChanges(original.owner, update.owner) 
    const owner_contact = findChanges(original.owner_contact, update.owner_contact)
    const ids = findChanges(original.ids, update.ids)
    const newAddresses = findAdditions(original.addresses, update.addresses)
    const newRoads = findAdditions(original.roads, update.roads)
    const newJobTypes = findAdditions(original.job_types, update.job_types)

    //one array to add new and one to update existing customers
    const customersToAdd = []
    const customersToUpdate = []
    if (Object.keys(client).length > 0) {
      update.ids.client_id ? customersToUpdate.push({customer: client, id: update.ids.client_id}) : customersToAdd.push({customer: client, idType: 'client_id'})
    }
    if (Object.keys(client_contact).length > 0) {
      update.ids.client_contact_id ? customersToUpdate.push({customer: client_contact, id: update.ids.client_contact_id}) : customersToAdd.push({customer: client_contact, idType: 'client_contact_id'})
    }
    if (Object.keys(owner).length > 0) {
      update.ids.owner_id ? customersToUpdate.push({customer: owner, id: update.ids.owner_id}) : customersToAdd.push({customer: owner, idType: 'owner_id'})
    }
    if (Object.keys(owner_contact).length > 0) {
      update.ids.owner_contact_id ? customersToUpdate.push({customer: owner_contact, id: update.ids.owner_contact_id}) : customersToAdd.push({customer: owner_contact, idType: 'owner_contact_id'})
    }
    //add new Prop, Client, (and if) C_Contact, Owner, O_Contact
    Promise.all([
      //addProp and add property_id to ids obj
      PropertyFactory.addNew({table: 'Properties', dbObj: property}).then( ({data}) => {
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
        JobFactory.addNew({dbObj: jobObj}).then( ({ data: { job_id, job_number }}) => {
          jobNumber = job_number
          jobId = job_id
        }).catch( err => Promise.reject(err)),
        //send address and road arrays with Prop id
        addSecondaryAddress(newAddresses, ids.property_id).then().catch( err => Promise.reject(err)),
        addSecondaryRoad(newRoads, ids.property_id).then().catch( err => Promise.reject(err))
      ]).then( () => {
        addJobTypesToJob(newJobTypes, jobId).then( () => $mdDialog.hide(jobNumber)).catch( err => console.log('err', err))
      }).catch( err => console.log('err', err))
    }).catch( err => console.log('err', err))

  }


  const findChanges = (original, update) => {
    return Object.keys(update).reduce( (obj, key) => {
      if (update[key] !== original[key]) {
        obj[key] = update[key]
      } 
      return obj
    },{})
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

  const addNewCustomers = customersToAdd => {
    return new Promise( (resolve, reject) => {
      Promise.all(customersToAdd.map( customer => {
        let dbPackage = {table: 'Customers', dbObj: customer.customer, idType: customer.idType}
        return CustomerFactory.addNew(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const updateExistingCustomers = customersToUpdate => {
    return new Promise( (resolve, reject) => {
      Promise.all(customersToUpdate.map( customer => {
        let dbPackage = {table: 'Customers', dbObj: customer.customer, customer_id: customer.id }
        return CustomerFactory.updateExisting(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const addSecondaryAddress = (newAddresses, property_id) => {
    return new Promise( (resolve, reject) => {
      Promise.all(newAddresses.map( address => {
        let dbPackage = {table: 'Addresses', address: address, property_id: property_id}
        return PropertyFactory.addSecondaryAddress(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const removeSecondaryAddress = (addresses, property_id) => {
    return new Promise( (resolve, reject) => {
      Promise.all(addresses.map( address => {
        let dbPackage = {table: 'Addresses', address: address, property_id: property_id}
        return PropertyFactory.removeSecondaryAddress(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const addSecondaryRoad = (newRoads, property_id) => {
    return new Promise( (resolve, reject) => {
      Promise.all(newRoads.map( road => {
        let dbPackage = {table: 'Roads', road: road, property_id: property_id}
        return PropertyFactory.addSecondaryRoad(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const removeSecondaryRoad = (roads, property_id) => {
    return new Promise( (resolve, reject) => {
      Promise.all(roads.map( road => {
        let dbPackage = {table: 'Roads', road: road, property_id: property_id}
        return PropertyFactory.removeSecondaryRoad(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
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

  const removeJobTypesFromJob = (jobTypes, jobId) => {
    return new Promise( (resolve, reject) => {
      Promise.all(jobTypes.map( job_type => {
        let dbPackage = {table: 'Job_Types', job_type, job_id: jobId}
        return JobTypeFactory.removeJobTypeFromJob(dbPackage).then( ({data}) => Promise.resolve(data)).catch( err => Promise.reject(err))
      })).then( data => resolve(data)).catch( err => console.log('err', err))
    })
  }

  const updateJob = (jobObj, job_number) => {
    return new Promise( (resolve, reject) => {
      //if changes were made
      if (Object.keys(jobObj).length > 0) {
        JobFactory.updateExisting({dbObj: jobObj, job_number}).then( () => {
          resolve()
        })
        .catch( err => reject(err))
      } else {
        //do nothing
        resolve()
      }  
    })
  }

  const updateProp = (prop, prop_id) => {
    return new Promise( (resolve, reject) => {
      //if changes were made
      if (Object.keys(prop).length > 0) {
        PropertyFactory.updateExisting({table: 'Properties', dbObj: prop, id: prop_id}).then( () => {
          resolve()
        })
        .catch( err => reject(err))
      } else {
        //do nothing
        resolve()
      }  
    })
  }

  return factory
})