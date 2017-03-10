'use strict'

const { createReadStream, createWriteStream } = require('fs')
const config = require('../database/knexfile').development
const knex = require('knex')(config)


const getNameAndExtension = fullFile => {
  let startIndex = (fullFile.indexOf('\\') >= 0 ? fullFile.lastIndexOf('\\') : fullFile.lastIndexOf('/'));
  let file = fullFile.substring(startIndex);
  if (file.indexOf('\\') === 0 || file.indexOf('/') === 0) {
      file = file.substring(1);
  }
  return {
    file_name: file.substr(0, file.lastIndexOf(".")),
    extension: file.substr(file.lastIndexOf("."))
  }  
}


module.exports = {

  streamToDatabase: (fullFile, job_id) => {
    let { file_name, extension } = getNameAndExtension(fullFile)
    let bufferArray = []
    let stream = createReadStream(fullFile)

    stream.on('data', chunk => {
      bufferArray.push(chunk)
    });

    stream.on('end', () => {
      let file = Buffer.concat(bufferArray)
      knex('Attachments')
      .insert({
        job_id,
        file_name,
        extension,
        file,
      })
      .then( data => 
      console.log("done")
      )
    })

    stream.on('error', err => console.log('error', err))
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