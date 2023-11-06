const client = require('../../connection')
const express = require('express');
const userRepository = require('../../repository/userRepository')
const {encrypt, compare} = require('../helpers/handleBcrypt')
const {tokenSign} = require('../helpers/generateToken')


const createUser = async (req, res)=> {
    let { fullname, email,birthdate, age, pass, pass2, usertypeid} = req.body;
    let errors = []
    if (!fullname || !email ||!birthdate ||!age ||!pass || !pass2 || !usertypeid) {
        errors.push({ message: "Por favor ingrese todos los campos"});
    }

    if (pass.length < 6){
        errors.push({message: "La contraseña de tener al menos 6 caractares"})
    }

    if (pass !== pass2){
        errors.push({massage:"La contraseña no coinciden"});
    }
    
    if (errors.length > 0){
        res.send(
            {
              message: "Error al intentar crear usuario.",
              data: errors
            }
        )
    }

    const { hashedPass, salt } = await encrypt(pass);
    console.log(hashedPass, salt);
    // validar
    const emailExists = await userRepository.userEmailExists(email);
    if (emailExists) {
        res.send(
            {
              message: "El correo utilizado ya existe.",
            }
        )
    }

    const newUser = { fullname, email, birthdate, age, pass: hashedPass, usertypeid, salt}
    const userCreated = await userRepository.create(newUser)

    res.send({
        message: "Usuario registrado con éxito.",
        data: userCreated
    })
};

const login = async (req, res) => {
    try {
        
        const { email, pass } = req.body;
    let errors = []

    if (!email || !pass) {
        errors.push({ message: "Por favor ingrese todos los campos"});

    }
    if (errors.length > 0){

        res.send(
            {
              message: "Error al intentar iniciar sesión1",
              data: errors
            }
    
        )
    }
    const getUser = await userRepository.getUserByEmail(email.trim());



    if(getUser){

        const { hashedPass, salt} = await encrypt(pass, getUser.salt);
        const userIsValid = await compare(pass, hashedPass);
        if (userIsValid) {
            const token = tokenSign(getUser)
            console.log(token)

            res.send({
                message:'',
                data: {
                    token,
                    user: getUser
                }
            })
        }
    }
    res.send(
        {
          message: "Error al intentar iniciar sesión3"
        }
    )
        
    } catch (error) {
        console.error(error)

        
    }
    
}

module.exports = { createUser, login };

  