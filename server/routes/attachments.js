'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const attachmentHelper = require('../attachmentHelper')
const { createReadStream, createWriteStream } = require('fs')

router.post('/api/openFile',  ({body: {attachment_id}}, res) => {
 console.log('attachment_id', attachment_id)
})

router.post('/api/upload', (req, res) => {
  let bufferArray = []
  let formData = {}
  let filePath  //--------------------------------------------------------------------if not using electron, must write file first then create buffer array
  let fileName

  req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => { //-------get file and filename
    fileName = filename
    filePath = `${__dirname}/../uploads/${filename}`
    file.pipe(createWriteStream(filePath))
  })

  req.busboy.on('field', (fieldname, val) => { //--------------------------------------get formData
    formData[fieldname] = val   //-----------------------------------------------------somehow loops over formData and creates obj with fieldnames and val 
  })

  req.busboy.on('finish', () => {
    let stream = createReadStream(filePath)

    stream.on('data', chunk => {
      bufferArray.push(chunk)
    })

    stream.on('end', chunk => {
      let file = Buffer.concat(bufferArray)
      let {file_name, extension} = attachmentHelper.getNameAndExtension(fileName)
      knex('Attachments')
      .insert({
        job_id: formData.job_id,
        file_name,
        extension,
        file,
      })  
      .then( data => res.send('Success'))
    })
  })

  req.pipe(req.busboy)
})


module.exports = router