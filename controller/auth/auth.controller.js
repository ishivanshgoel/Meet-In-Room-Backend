//auth middleware
const createError = require('http-errors')

/**
 * TODO: change secret and issuer, expiresIn time
 */


module.exports = {
    signAcessToken: (userId)=> {
        return new Promise((resolve, reject) => {
            const payload = {
               
            }
            const secret = 'some super secret'
            const options = {
                expiresIn : '1d',
                issuer: "meetInRoom",
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }
                return resolve(token)
            })
        })
    },

    verifyAccessToken: (req, res, next)=>{
        
        if(!req.headers['authorization']) return next(createError.Unauthorized())

        const authHeader = req.headers['authorization']

        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, 'some super secret', (err, payload)=>{
            if(err) {
                const message = 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        } )
    }
}