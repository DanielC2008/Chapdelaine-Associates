'use strict'

app.controller('JobMain', function($scope, PropertyFactory) {
  let JMScope = this

  JMScope.showAddresses = property_id => {
    PropertyFactory.getAddressesOnProp(property_id)
    .then( ({data}) => {
      console.log('data', data)
      JMScope.allAddresses = data})
    .catch( err => console.log('err', err))
  }

  JMScope.hideAddresses = () => {
    JMScope.allAddresses = null
  }

  JMScope.showRoads = property_id => {
    PropertyFactory.getRoadsOnProp(property_id)
    .then( ({data}) => JMScope.allRoads = data)
    .catch( err => console.log('err', err))
  }

  JMScope.hideRoads = () => {
    JMScope.allRoads = null
  }

})