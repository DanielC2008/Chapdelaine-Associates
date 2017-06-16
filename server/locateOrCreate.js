'use strict'

const config = require('../database/knexfile.js').development
const knex = require('knex')(config)

//this module is used to locate or create a specific item on a table and return it's id for many to many or one to many relationships

module.exports = {

  state: state => {
    return new Promise( (resolve, reject) => {
      if(!state) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {  
        knex('States')
        .select('state_id')
        .where('state', state)
        .then( data => {
          if (data[0]) {
            resolve(data[0].state_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('States')
            .returning('state_id')
            .insert({state: state})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  city: city => {
    return new Promise( (resolve, reject) => {
      if(!city) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Cities')
        .select('city_id')
        .where('city', city)
        .then( data => {
          if (data[0]) {
            resolve(data[0].city_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('Cities')
            .returning('city_id')
            .insert({city: city})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  county: county => {
    return new Promise( (resolve, reject) => {
      if(!county) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Counties')
        .select('county_id')
        .where('county', county)
        .then( data => {
          if (data[0]) {
            resolve(data[0].county_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('Counties')
            .returning('county_id')
            .insert({county: county})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  zip_code: zip_code => {
    return new Promise( (resolve, reject) => {
      if(!zip_code) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Zip_Codes')
        .select('zip_id')
        .where('zip_code', zip_code)
        .then( data => {
          if (data[0]) {
            resolve(data[0].zip_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('Zip_Codes')
            .returning('zip_id')
            .insert({zip_code: zip_code})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  address: address => {
    return new Promise( (resolve, reject) => {
      if(!address) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Addresses')
        .select('address_id')
        .where('address', address)
        .then( data => {
          if (data[0]) {
            resolve(data[0].address_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('Addresses')
            .returning('address_id')
            .insert({address: address})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  road: road => {
    return new Promise( (resolve, reject) => {
      if(!road) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Roads')
        .select('road_id')
        .where('road', road)
        .then( data => {
          if (data[0]) {
            resolve(data[0].road_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('Roads')
            .returning('road_id')
            .insert({road: road})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  client_type: client_type => {
    return new Promise( (resolve, reject) => {
      if(!client_type) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Client_Types')
        .select('client_type_id')
        .where('client_type', client_type)
        .then( data => {
          if (data[0]) {
            resolve(data[0].client_type_id)
            reject(err => console.log('err', err))
          } 
          else {
            knex('Client_Types')
            .returning('client_type_id')
            .insert({client_type: client_type})
            .then( data => {
              resolve(data[0])
              reject(err => console.log('err', err))
            })
          }
        })
      }  
    })
  },

  company_name: (company_name, company_address) => {
    return new Promise( (resolve, reject) => {
      if(!company_name) { 
        resolve(null) 
        reject(err => console.log('err', err))
      }
      else {   
        knex('Companies')
        .select(
          'Companies.company_id', 
          'Addresses.address'
        )
        .leftJoin('Addresses', 'Companies.address_id', 'Addresses.address_id')
        .where('company_name', company_name)
        .then( data => {
          if (data[0]) { //----------------------------------------company exists
            if(data[0] && data[0].address != company_address) { // if company address has changed change it
              module.exports.address(company_address)
              .then( address_id => { 
                knex('Companies')
                .where('company_name', company_name)
                .update({address_id: address_id})
                .then( () => {
                  resolve(data[0].company_id)
                  reject(err => console.log('err', err))
                })
              })  
            } else {
              resolve(data[0].company_id)
              reject(err => console.log('err', err))  
            }
          } else { //------------------------------------create company
            module.exports.address(company_address) // if  new company need to find address on address table first
            .then( address_id => {   
              knex('Companies')
              .returning('company_id')
              .insert({company_name: company_name, address_id: address_id})
              .then( data => {
                resolve(data[0])
                reject(err => console.log('err', err))
              })
            })
          }
        })
      }  
    })
  }

}
