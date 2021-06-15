const express = require('express')
const auth = express.Router()
const createError = require('http-errors')
const firebase = require("firebase")
require("firebase/auth")

auth.post("/login", (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) throw createError.BadRequest('Bad Request')

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                
                let { uid, refreshToken } = userCredential.user
                
                /**
                 * uid - userid
                 * refreshToken - to reverify user
                 */
                res.json({
                    uid,
                    refreshToken
                })
            })
            .catch((error) => {
                next(error)
            })

    } catch (error) {
    next(error)
}

})

auth.post("/register", async (req, res, next) => {

    try {

        const { email, password } = req.body;

        // validating request 
        if (!email || !password) throw createError.BadRequest('Bad Request')

        // attempt to create user account with given email and password
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let { uid, refreshToken } = userCredential.user
                
                /**
                 * uid - userid
                 * refreshToken - to reverify user
                 */
                res.json({
                    uid,
                    refreshToken
                })
            })
            .catch((error) => {
                next(error)
            })

    } catch (err) {
        next(err)
    }
})


module.exports = auth