'use strict'

const { createReadStream, createWriteStream } = require('fs')
const config = require('../database/knexfile').development
const knex = require('knex')(config)

module.exports = {

  getNameAndExtension: fullFile => {
    let startIndex = (fullFile.indexOf('\\') >= 0 ? fullFile.lastIndexOf('\\') : fullFile.lastIndexOf('/'));
    let file = fullFile.substring(startIndex);
    if (file.indexOf('\\') === 0 || file.indexOf('/') === 0) {
        file = file.substring(1);
    }
    return {
      file_name: file.substr(0, file.lastIndexOf(".")),
      extension: file.substr(file.lastIndexOf("."))
    }  
  },

  streamFromDatabase: fileToGet => {
    knex('Attachments')
    .where('file_name', fileToGet)
    .then( data => {
      let {job_id, file_name, extension, file} = data[0]
      let writeFile = createWriteStream(`C:\\Users\\Joseph\\Chapdelaine-Associates\\Chapdelaine-Associates\\database\\attachmentTest\\NEW${file_name}${extension}`, {autoClose: true})
      writeFile.write(file)
      writeFile.on('error', err => console.log('error', err))
    })
  }
}
