'use strict'

const config = require('../database/knexfile.js').development
const knex = require('knex')(config)

module.exports = {

  state: state => {
    return new Promise( (resolve, reject) => {
      if(!state) { 
        resolve(null) 
        reject()
      }
      else {  
        knex('States')
        .select('state_id')
        .where('state', state)
        .then( data => {
          if (data[0]) {
            resolve(data[0].state_id)
            reject()
          } 
          else {
            knex('States')
            .returning('state_id')
            .insert({state: state})
            .then( data => {
              resolve(data[0])
              reject()
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
        reject()
      }
      else {   
        knex('Cities')
        .select('city_id')
        .where('city', city)
        .then( data => {
          if (data[0]) {
            resolve(data[0].city_id)
            reject()
          } 
          else {
            knex('Cities')
            .returning('city_id')
            .insert({city: city})
            .then( data => {
              resolve(data[0])
              reject()
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
        reject()
      }
      else {   
        knex('Counties')
        .select('county_id')
        .where('county', county)
        .then( data => {
          if (data[0]) {
            resolve(data[0].county_id)
            reject()
          } 
          else {
            knex('Counties')
            .returning('county_id')
            .insert({county: county})
            .then( data => {
              resolve(data[0])
              reject()
            })
          }
        })
      }  
    })
  },

  zip: zip => {
    return new Promise( (resolve, reject) => {
      if(!zip) { 
        resolve(null) 
        reject()
      }
      else {   
        knex('Zip_Codes')
        .select('zip_id')
        .where('zip', zip)
        .then( data => {
          if (data[0]) {
            resolve(data[0].zip_id)
            reject()
          } 
          else {
            knex('Zip_Codes')
            .returning('zip_id')
            .insert({zip: zip})
            .then( data => {
              resolve(data[0])
              reject()
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
        reject()
      }
      else {   
        knex('Addresses')
        .select('address_id')
        .where('address', address)
        .then( data => {
          if (data[0]) {
            resolve(data[0].address_id)
            reject()
          } 
          else {
            knex('Addresses')
            .returning('address_id')
            .insert({address: address})
            .then( data => {
              resolve(data[0])
              reject()
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
        reject()
      }
      else {   
        knex('Client_Types')
        .select('client_type_id')
        .where('client_type', client_type)
        .then( data => {
          if (data[0]) {
            resolve(data[0].client_type_id)
            reject()
          } 
          else {
            knex('Client_Types')
            .returning('client_type_id')
            .insert({client_type: client_type})
            .then( data => {
              resolve(data[0])
              reject()
            })
          }
        })
      }  
    })
  }

}
