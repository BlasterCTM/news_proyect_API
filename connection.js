const {Pool} = require('pg')


//CONEXION CON ORM SEQUELIZE 
// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('news_db', 'postgres', 'postgres', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

//CONEXION NO ORN - PERMITE QUERYS DE SQL
const client = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "news_db"
})

module.exports = client;
