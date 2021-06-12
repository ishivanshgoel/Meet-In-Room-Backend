const express = require('express')
const call = express.Router()
//const { verifyAccessToken } = require('../../controller/auth/auth.controller')


//verify user
//call.use(verifyAccessToken())

//capture io object 
let socket
const callService = require('../../services/call/call.service')

call.get('/', (req, res, next) => {
    let sender = '1234'
    let receiver = '2334'
    console.log('Call Service in Action')

    // emit call event
    const eventEmitter = req.app.eventEmitter
    eventEmitter.emit('send-call-offer', {sender: sender, receiver: receiver})
    
    
    // sending call
    //callService(socket, sender, receiver)

    res.send('new call')
})


module.exports = call
