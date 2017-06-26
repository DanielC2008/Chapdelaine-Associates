'use strict'

app.factory('AttachmentFactory', function($http) {

  const factory = {}

  factory.openFile = attachment_id => $http.post('/api/openFile', attachment_id)

  factory.deleteFile = attachment_id => $http.post('/api/deleteFile', attachment_id)

  return factory
})  