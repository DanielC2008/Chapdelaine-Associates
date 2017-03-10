'use strict'

app.controller('JobAttachment', function($scope, JobFactory) {
  let JAScope = this

  JAScope.attachments = $scope.Attachments

  JAScope.openFile = id => {
    JobFactory.openFile({attachment_id: id})
  }

})