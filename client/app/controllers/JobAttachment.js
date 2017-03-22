'use strict'

app.controller('JobAttachment', function($scope, JobFactory, FileUploader, $route) {
  let JAScope = this

  JAScope.attachments = $scope.Attachments
  JAScope.uploader = new FileUploader({
    url: `/api/upload`,
    onBeforeUploadItem(item) {
      item.formData.push({job_id: $scope.jobId})
    },
    onSuccessItem(item, response, status, headers) {
      $route.reload()
      JobFactory.toastSuccess(response)  // on reload needs to go to Attachment, either change url or variable
    }
  })

  JAScope.openFile = id => {
    JobFactory.openFile({attachment_id: id})
      .then(({data}) => alert(data))
  }


})