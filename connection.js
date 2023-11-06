const {Pool} = require('pg')


//CONEXION NO ORN - PERMITE QUERYS DE SQL
const client = new Pool({
    host: "rds-game-connect.chvuxlhkl8lq.us-east-2.rds.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "game_connectAPI"
})

module.exports = client;
