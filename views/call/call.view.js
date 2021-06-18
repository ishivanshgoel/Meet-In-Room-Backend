const express = require('express')
const call = express.Router()
const createError = require('http-errors')
const { db } = require("../../setup/firebase/firebase.setup")
const { uuid } = require('uuidv4');
//const { verifyAccessToken } = require('../../controller/auth/auth.controller')


//verify user
//call.use(verifyAccessToken())

let socket
const callService = require('../../services/call/call.service')

call.post('/calloffer', (req, res, next) => {

    try{
        let { sender, receiver } = req.body

        console.log("Sender Peer id ", sender)

        if(!sender || !receiver) throw createError.BadRequest('Bad Request')

        console.log('Call Service in Action')

        // global event emitter
        const eventEmitter = req.app.get('eventEmitter')
        const roomId = uuid()
        eventEmitter.emit('send-call-offer', {roomId: roomId, sender: sender, receiver: receiver})
        
        res.send({
            roomId,
            sender,
            receiver
        }) 

    } catch(error){
        next(error)
    }
    
})

call.get('/contactlist', (req, res, next)=>{

    try{
        let constactList
        db.collection('users').get().then((data)=>{
            constactList = data.docs.map(doc => {
                return {
                    id: doc.id,
                    email: doc.data().email
                }   
            })

            res.json(constactList)
        }).catch((err)=>{
            next(err)
        })
        
    } catch(error){
        next(error)
    }

})


module.exports = call
