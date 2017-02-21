'use strict'

module.exports = {

  getTableInfo: table => {
    
    let tableObj = {} 
    switch(table) {
      case 'Clients':
        tableObj.tableName = 'Clients'
        tableObj.connectTable = 'Jobs_Clients'
        tableObj.returningId = 'client_id'
        break;
      case 'Representatives':
        tableObj.tableName = 'Representatives'
        tableObj.connectTable = 'Clients_Representatives'
        tableObj.returningId = 'representative_id'
        break;
      case 'Properties':
        tableObj.tableName = 'Properties'
        tableObj.connectTable = 'Jobs_Properties'
        tableObj.returningId = 'property_id'
        break;
    }
    return tableObj
  }

  














  
}
