'use strict'

app.controller('JobAttachment', function($scope, JobFactory, FileUploader) {
  let JAScope = this

  JAScope.attachments = $scope.Attachments
  JAScope.uploader = new FileUploader({
    url: `/api/upload`,
    onBeforeUploadItem(item) {
      item.formData.push({job_id: $scope.jobId, test: 'test'})
    },
    onSuccessItem(item, response, status, headers) {
    }
  })

  JAScope.openFile = id => {
    JobFactory.openFile({attachment_id: id})
  }


})