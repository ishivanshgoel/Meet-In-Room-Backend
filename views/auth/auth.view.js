const express = require('express')
const auth = express.Router()
const createError = require('http-errors')
const { db, firebaseauth } = require("../../setup/firebase/firebase.setup.js")



auth.post("/login", (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) throw createError.BadRequest('Bad Request')

        firebaseauth.signInWithEmailAndPassword(email, password)
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
        firebaseauth.createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                let { uid, refreshToken } = userCredential.user
                
                //save uid and users email to users collection in firestore
                await db.collection('users').doc(uid).set({
                    email: email,
                });

                
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