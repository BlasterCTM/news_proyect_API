const { verifyToken } = require('../helpers/generateToken')

const checkAuth = async (req, res, next) => {
    try {
     
        const token = req.headers.authorization.split(' ').pop() 
        const tokenData = await verifyToken(token)
        if (tokenData._id) {
            next()
        } else {
            res.status(409)
            res.send({ error: 'Acceso Restringido ' })
        }

    } catch (e) {
        console.log(e)
        res.status(409)
        res.send({ error: 'Acceso Restringido ' })
    }

}

module.exports = checkAuth
