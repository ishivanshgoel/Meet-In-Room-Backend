const express = require('express')
const call = express.Router()
//const { verifyAccessToken } = require('../../controller/auth/auth.controller')


//verify user
//call.use(verifyAccessToken())

let socket
const callService = require('../../services/call/call.service')

call.get('/', (req, res, next) => {

    
    let sender = 'shivansh'
    let receiver = 'karan'
    console.log('Call Service in Action')

    // global event emitter
    const eventEmitter = req.app.get('eventEmitter')

    // make a call offer
    eventEmitter.emit('send-call-offer', {sender: sender, receiver: receiver})
    
    res.send('new call')
})


module.exports = call
