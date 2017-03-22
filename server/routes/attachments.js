'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const attachmentHelper = require('../attachmentHelper')
const { createReadStream, createWriteStream } = require('fs')
const open = require('open')

router.post('/api/openFile',  ({body: {attachment_id}}, res) => {
 knex('Attachments')
  .select('file_name', 'extension')
  .where('attachment_id', attachment_id)
  .then( data => {
    let {file_name, extension} = data[0]
    open(`${__dirname}/../uploads/${file_name}${extension}`)
    res.send("Don't forget to save your work!")
  })
  .catch( err => res.send(err))

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
      .then( data => res.send('Upload Complete!'))
      .catch( err => res.send(err))
    })
  })

  req.pipe(req.busboy)
})


module.exports = router