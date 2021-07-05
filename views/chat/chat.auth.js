const express = require('express')
const chat = express.Router()
const createError = require('http-errors')
const { db } = require("../../setup/firebase/firebase.setup")

chat.post('/sendmessage', (req, res, next) => {

    try {
        const { roomId, from, message } = req.body

        if (!roomId || !from || !message) throw createError.BadRequest('Bad Request')

        let newMessage = { from, message }
        db.collection('meetingRoomMessages')
            .doc(roomId)
            .get()
            .then((data) => {
                console.log(data.data())
                let allMessages 
                if(data.data() && data.data().messages){
                    allMessages = data.data().messages
                }
                if(!allMessages) allMessages = [newMessage]
                else allMessages.push(newMessage)
                db.collection('meetingRoomMessages')
                    .doc(roomId)
                    .set({ messages: allMessages })
                    .then(() => {
                        // global event emitter
                        // const eventEmitter = req.app.get('eventEmitter')
                        // eventEmitter.emit('room-message', { from: from, roomIdMy: roomId, message: message })
                        res.send(true)
                    })
                    .catch((err) => {
                        next(err)
                    })
            })
    } catch (err) {
        next(err)
    }
})

chat.post('/getall', (req, res, next)=>{

    try{

        const { roomId } = req.body

        if (!roomId) throw createError.BadRequest('Bad Request')

        db.collection('meetingRoomMessages')
            .doc(roomId)
            .get()
            .then((data)=>{
                let messages
                if(data.data() && data.data().messages){
                    messages = data.data().messages
                } else{
                    messages = []
                }
                res.send(messages)
            })
            .catch((err)=>{
                next(err)
            })

    } catch(err){
        next(err)
    }

})


module.exports = chat