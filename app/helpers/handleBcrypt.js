const bcrypt = require('bcrypt') 
const bcryptjs = require('bcryptjs') 

const encrypt = async (password, salt = bcrypt.genSaltSync(10)) => {
    const hashedPass = await bcrypt.hashSync(password, salt);
    return {
        hashedPass,
        salt
    }
}

const compare = async (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword)
}

module.exports = { encrypt, compare }
