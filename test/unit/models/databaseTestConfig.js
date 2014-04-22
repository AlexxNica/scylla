module.exports = {
    user:'scylla',
    password:'scylla',
    properties:{
        dialect: 'sqlite',
        storage: __dirname + '/test-database.sqlite'
    }
}