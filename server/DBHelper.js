'use strict'

module.exports = {

  getTableInfo: table => {
    
    let tableObj = {} 
    switch(table) {
      case 'Clients':
        tableObj.tableName = 'Clients'
        tableObj.connectTable = 'Jobs_Clients'
        tableObj.returningId = 'client_id'
        tableObj.findJobId = 'job_id'
        break;
      case 'Representatives':
        tableObj.tableName = 'Representatives'
        tableObj.connectTable = 'Clients_Representatives'
        tableObj.returningId = 'representative_id'
        tableObj.findJobId = 'job_id'
        break;
      case 'Properties':
        tableObj.tableName = 'Properties'
        tableObj.connectTable = 'Jobs_Properties'
        tableObj.returningId = 'property_id'
        tableObj.findJobId = 'job_id'
        break;
      case 'Types Of Work':
        tableObj.tableName = 'Types_Of_Work'
        tableObj.connectTable = 'Types_Invoices'
        tableObj.returningId = 'type_of_work_id'
        tableObj.findJobId = 'invoice_id'
        break;
      case 'Jobs':
        tableObj.tableName = 'Jobs'
        tableObj.tableNumber = 'job_number'
        break;
      case 'Invoices':
        tableObj.tableName = 'Invoices'
        tableObj.connectTable = 'Types_Invoices'
        tableObj.connectTableId = 'types_invoices_id'
        tableObj.tableNumber = 'invoice_number'
        break;
      case 'Estimates':
        tableObj.tableName = 'Estimates'
        tableObj.connectTable = 'Types_Estimates'
        tableObj.connectTableId = 'types_estimates_id'
        break;
    }
    return tableObj
  }

  














  
}
