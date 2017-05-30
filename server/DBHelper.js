'use strict'

module.exports = {

  getTableInfo: table => {
    
    let tableObj = {} 
    switch(table) {
      case 'Clients':
        tableObj.tableName = 'Clients'
        tableObj.connectTable = 'Client_Specs_Per_Job'
        tableObj.returningId = 'client_id'
        tableObj.findJobId = 'job_id'
        break;
      case 'Representatives':
        tableObj.tableName = 'Representatives'
        tableObj.connectTable = 'Client_Specs_Per_Job'
        tableObj.returningId = 'representative_id'
        tableObj.findJobId = 'job_id'
        break;
      case 'Properties':
        tableObj.tableName = 'Properties'
        tableObj.connectTable = 'Jobs_Properties'
        tableObj.returningId = 'property_id'
        tableObj.findJobId = 'job_id'
        break;
      case 'Tasks':
        tableObj.tableName = 'Tasks'
        tableObj.connectTable = 'Invoices_Tasks'
        tableObj.returningId = 'task_id'
        tableObj.findJobId = 'invoice_id'
        break;
      case 'Jobs':
        tableObj.tableName = 'Jobs'
        tableObj.tableNumber = 'job_number'
        break;
      case 'Invoices':
        tableObj.tableName = 'Invoices'
        tableObj.connectTable = 'Invoices_Tasks'
        tableObj.connectTableId = 'invoice_task_id'
        tableObj.tableNumber = 'invoice_number'
        break;
      case 'Estimates':
        tableObj.tableName = 'Estimates'
        tableObj.connectTable = 'Estimates_Tasks'
        tableObj.connectTableId = 'estimate_task_id'
        break;
    }
    return tableObj
  }












  
}
