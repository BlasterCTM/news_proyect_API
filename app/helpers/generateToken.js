const jwt = require('jsonwebtoken')
require('dotenv').config();


const tokenSign = (user) => { 
    console.log("6",process.env.JWT_SECRET);
    return jwt.sign(
        {
            userid: user.userid
        }, 
        '89j192hkla/0oispkdmg0i', // ENV 
        {
            expiresIn: "2h", // tiempo de vida
        }
    );
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return null
    }
}

const decodeSign = (token) => { 
    return jwt.decode(token, null)
}



module.exports = { tokenSign, decodeSign, verifyToken }
