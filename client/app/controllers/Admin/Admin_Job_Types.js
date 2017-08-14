'use strict'

app.controller('Admin_Job_Types', function($scope, JobTypeFactory, ToastFactory, DBFactory) {
  let JT = this

  JT.priorityChanged = false

  JobTypeFactory.getEnabledJobTypes().then( ({data}) => {
    JT.selected = null
    JT.job_types = data
  }) 

  JT.addNew = () => {
    JobTypeFactory.addNewJobType().then( ({dbPackage}) => {
      DBFactory.addNew(dbPackage).then( () => {
        $scope.setTabAndReload('JT')
      }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  JT.moved = index => {
    JT.job_types.splice(index, 1)
    JT.priorityChanged = true
  }

  JT.savePriority = () => {
    reprioritize()
    let dbPackage = priorityPackage()
    JobTypeFactory.reprioritizeJobTypes(dbPackage).then( ({data: {msg}}) => {
      $scope.setTabAndReload('JT')
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  JT.disable = type => {
    JobTypeFactory.disableJobType(type.job_type_id).then( ({data: {msg}}) => {
      $scope.setTabAndReload('JT')
    }).catch( err => err.msg ? ToastFactory.toastReject(err.msg) : console.log('err', err))
  }

  const reprioritize = () => {
    JT.job_types.forEach( (type, index) => type.priority = index)
  }

  const priorityPackage = () => {
    let dbPackage = JT.job_types.reduce( (arr, type) => {
      let obj = {
        job_type_id: type.job_type_id,
        priority: type.priority
      }
      arr.push(obj)
      return arr
    }, [])
    return dbPackage
  }

})