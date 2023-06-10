const client = require('../connection.js')
const express = require('express');
const router = express.Router();

const create = async (newUser) => {
    try {
        const { fullname, email, pass, birthdate, age, usertypeid, salt } = newUser;
        let insertQuery = `insert into users(fullname, email, pass, birthdate, age, usertypeid, active, salt)
        values ('${fullname}', '${email}', '${pass}', '${birthdate}', '${age}','${usertypeid}', '${true}', '${salt}') RETURNING *;`;
        const results = await client.query(insertQuery);
        return results.rows[0]        
    } catch (error) {
        return "Hubo un error al intentar crear usuario."
    }
}

const update = async (id, newUser) => {
    try {
        const { fullname, email, pass, birthdate, age, usertypeid } = newUser;
        const results = await client.query('UPDATE users SET fullname=$1, email=$2, pass=$3, birthdate=$4, age=$5, usertypeid=$6 WHERE userid=$7', [fullname, email, pass, birthdate, age, usertype, id]);
        return results.rows[0]
    } catch (error) {
        return `Hubo un error al intentar actualizar usuario ${id}.`
    }
}

const deleteById = async (id) => {
    try {
        const results = await client.query('UPDATE users SET active = $1 WHERE userid = $2 RETURNING *', [false, id]);
        if (results.rows[0]) { 
            return true 
        }
    } catch (error) {
        return `Hubo un error al intentar eliminar usuario ${id}.`
    }
}

const getAll = async () => {
    try {
        const results = await client.query(`Select * from users where active = true`);
        return results.rows
    } catch (error) {
        return error+" : Hubo un error al intentar obtener usuarios ."
    }
}

const getById = async (id) => {
    try {
        const results = await client.query(`Select * from users where userid=${id} and active=true`);
        console.log(results.rows)

        return results.rows
    } catch (error) {
      return `Hubo un error al intentar obtener usuario con id ${id}`  
    }
}

const userEmailExists = async (email) => {
    try {
        const results = await client.query(`Select * from users where email=${email} and active=true`)
        console.log(results.rows.length > 0)
        if (results.rows) return true
        return false
    } catch (error) {

    }
}

const getUserByEmail = async (email) => {
    try {
       

        const results = await client.query(`Select * from users where email='${email}' and active=true`)

        return results.rows[0]

    
    } catch (error) {
        console.log(error);
    }
}

module.exports = {create, update, deleteById, getAll, getById, userEmailExists, getUserByEmail};

