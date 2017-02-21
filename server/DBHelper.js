'use strict'

module.exports = {

  getTableInfo: table => {
    
    let tableObj = {} 
    switch(table) {
      case 'Clients':
        tableObj.name = 'Clients'
        tableObj.connectTable = 'Jobs_Clients'
        tableObj.returningId = 'client_id'
        break;
      case 'Representatives':
        tableObj.name = 'Representatives'
        tableObj.connectTable = 'Clients_Representatives'
        tableObj.returningId = 'representative_id'
        break;
      case 'Properties':
        tableObj.name = 'Properties'
        tableObj.connectTable = 'Jobs_Properties'
        tableObj.returningId = 'property_id'
        break;
    }
    return tableObj
  }
  
}
