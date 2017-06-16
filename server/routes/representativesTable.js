'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateRep = require('../validation/validRepresentative')
const validationHelper = require('../validation/validationHelper')

router.post('/api/removeRepFromJob', ({body: {objToRemove}}, res) => {
  knex('Client_Specs_Per_Job')
    .update('representative_id', null) //-----------------update to null so we keep client associated with job
    .where(objToRemove)
    .then( data => {res.send({msg: 'Removed from Job!'})})
    .catch( err => console.log(err))
})

router.post('/api/addExistingRepToJob', ({body: {objToAdd: {representative_id, job_id, client_id}}}, res) => {
  knex('Client_Specs_Per_Job')  
      .update({ representative_id }) //----------------this update means that there can only be one rep per client per job
      .where({
        job_id,
        client_id
      }) 
    .then( () => res.send({msg: 'Successfully added to Job!'}))
    .catch( err => console.log(err))
})

router.post('/api/addNewRepToJob', ({body: {dbObj, idsArr}}, res) => {
  const job_id = idsArr[0]
  const client_id = idsArr[1]
  const errors = validateRep.validate(dbObj)
  if (errors[0]) {  //------------------------------------checks each data type
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send(msg)
  } else {
    validationHelper.checkNameExists(dbObj, 'Clients').then( nameExists => {//true/false
      if (nameExists) { //-----------------------------checks if name already exists in DB
        res.status(400).send(nameExists)
      } else {
        getConnectTableIds(dbObj).then( data => {
        let polishedObj = data.obj
        knex('Representatives')     //----------make rep
        .returning('representative_id')
        .insert(polishedObj)
        .then( data => {
          let representative_id = data[0]
          knex('Client_Specs_Per_Job')  //-----set ids on connecting table
          .update({ representative_id })   //--this update means that there can only be one rep per client per job  
          .where(client_id)
          .andWhere(job_id)
          .then( data => res.send({msg: 'Successfully created and added to Job!'}))
          .catch( err => console.log(err))
        }).catch( err => console.log(err))
      })
      } 
    })   
  }
})


// router.post('/api/updateClient', ({body: {dbObj, idsArr}}, res) => {
//   const clientId = idsArr[1]
//   const jobId = idsArr[0]
//   const errors = validateClient.validate(dbObj)
//   if (errors[0]) {  //------------------------------------checks each data type
//     let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
//     res.status(400).send(msg)
//   } else {
//     validationHelper.checkNameExistsOnEdit(clientId, dbObj, 'Clients').then( nameExists => {//true/false
//       if (nameExists) { //-----------------------------checks if name already exists in DB
//         res.status(400).send(nameExists)
//       } else {
//         let main = dbObj.main
//         delete dbObj.main
//         getConnectTableIds(dbObj).then( data => {
//           let client_type_id = data.client_type_id
//           let polishedObj = data.obj
//           knex('Clients') //------------------------find client
//           .update(polishedObj)
//           .where(clientId)
//           .then( () => {
//             knex('Client_Specs_Per_Job')//------set ids on connecting table
//             .update({
//               client_type_id, 
//               main
//             })
//             .where(clientId)
//             .andWhere(jobId)
//             .then( data => res.send({msg: 'Successfully updated Job!'}))
//             .catch( err => console.log(err))
//           }).catch( err => console.log(err))        
//         })
//       }
//     })
//   }
// })


const getConnectTableIds = obj => {
  return new Promise( (resolve, reject) => {
    Promise.all([  //-----------------get existing state, city, address, county, zip_code
      locateOrCreate.state(obj.state)
      .then( data => {
        delete obj.state
        obj.state_id = data
      }),
      locateOrCreate.city(obj.city).then( data => { 
        delete obj.city
        obj.city_id = data
      }),
      locateOrCreate.address(obj.address).then( data => { 
        delete obj.address
        obj.address_id = data
      }),
      locateOrCreate.county(obj.county).then( data => { 
        delete obj.county
        obj.county_id = data
      }),
      locateOrCreate.zip_code(obj.zip_code).then( data => { 
        delete obj.zip_code
        obj.zip_id = data
      }),
      locateOrCreate.company_name(obj.company_name, obj.company_address).then( data => { 
        delete obj.company_name
        delete obj.company_address
        obj.company_id = data
      })
    ])
    .then( () => {
      let data = {obj: obj}
      resolve( data)
    })
  })
}


module.exports = router