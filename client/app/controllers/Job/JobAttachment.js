'use strict'

app.controller('JobAttachment', function($scope, AlertFactory, FileUploader, $route, AttachmentFactory) {
  let JAScope = this

  JAScope.attachments = $scope.Attachments
  JAScope.uploader = new FileUploader({
    url: `/api/upload`,
    onBeforeUploadItem(item) {
      item.formData.push({job_id: $scope.jobId})
    },
    onSuccessItem(item, response, status, headers) {
      $route.reload()
      AlertFactory.toastSuccess(response)  // on reload needs to go to Attachment, either change url or variable
    }
  })

  JAScope.openFile = id => AttachmentFactory.openFile({attachment_id: {attachment_id: id}}).then(({data}) => alert(data))

  JAScope.deleteFile = id => {
    AttachmentFactory.deleteFile({attachment_id: {attachment_id: id}})
      .then(({data}) => {
        $route.reload()
        AlertFactory.toastSuccess(data)
      })
  }

})