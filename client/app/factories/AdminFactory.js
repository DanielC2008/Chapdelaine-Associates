'use strict'

app.factory('AdminFactory', function() {
  const factory = {}
  let tab = ''

  factory.setTab = newTab => tab = newTab

  factory.getTab = () => tab


  return factory
})  