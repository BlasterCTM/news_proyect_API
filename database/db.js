// PG  CONNECTION

const { Pool } = require('pg');
const pool = new Pool({
    // Variable de entorno

    user: 'postgres',
    host: 'localhost',
    database: 'news_proyect',
    password: 'postgres',
    port: 5432
});


pool.connect((error)=>{
    if(error){
        console.error('El error de la conexion es: ' ,error);
        return;
    }
    console.log('Conectado a la DB');
});


module.exports = pool;












