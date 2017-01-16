// Update with your config settings.

const DBCreds = require('../DBCreds.js')


module.exports = {

  development: {
    client: 'mssql',
    connection: DBCreds,
    pool: {
      min: 0,
      max: 10
    }
  },

  staging: {
    client: 'mssql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mssql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
