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

    try {
        let { sender, receiver } = req.body

        console.log("Sender Peer id ", sender)

        if (!sender || !receiver) throw createError.BadRequest('Bad Request')

        console.log('Call Service in Action')

        // global event emitter
        const eventEmitter = req.app.get('eventEmitter')
        eventEmitter.emit('send-call-offer', { sender: sender, receiver: receiver })

        res.send(true)

    } catch (error) {
        next(error)
    }

})

call.get('/contactlist', (req, res, next) => {

    try {
        let constactList
        db.collection('users').get().then((data) => {
            constactList = data.docs.map(doc => {
                return {
                    id: doc.id,
                    email: doc.data().email
                }
            })

            res.json(constactList)
        }).catch((err) => {
            next(err)
        })

    } catch (error) {
        next(error)
    }

})

call.post('/addinroom', async (req, res, next) => {
    try {
        let { myId, userId, roomId } = req.body

        if (!myId || !userId || !roomId) throw createError.BadRequest('Bad Request')


        db.collection('meetingRooms').doc(roomId).get().then(async (data) => {
            console.log(data.data())
            let meetingRoom = await data.data()

            // allow only if the current user in owner of meetingRoom
            if (meetingRoom.owner === myId) {
                // add member in a room
                meetingRoom.members = [
                    ...meetingRoom.members,
                    userId
                ]

                // update in memebers collection
                db.collection("meetingRooms").doc(roomId)
                    .update({ members: meetingRoom.members })
                    .then(() => {

                        // add roomId in members collection
                        db.collection("users").doc(userId).get().then((data) => {
                            let userData = data.data()

                            // if meeting rooms are not initialted
                            if (!userData.meetingRooms) {
                                userData = {
                                    ...userData,
                                    meetingRooms: [roomId]
                                }
                            } else {
                                userData = {
                                    ...userData,
                                    meetingRooms: [
                                        ...userData.meetingRooms,
                                        roomId
                                    ]
                                }
                            }

                            // update in users collection
                            db.collection("users").doc(userId)
                                .set(userData)
                                .then(() => {
                                    res.send(true)
                                }).catch((err) => {
                                    next(err)
                                })
                        }).catch((err) => {
                            next(err)
                        })
                    }).catch((err) => {
                        next(err)
                    })


            } else {
                throw createError.Unauthorized('Permission Denied')
            }

        }).catch((err) => {
            next(err)
        })
    } catch (err) {
        next(err)
    }
})

call.post('/createroom', async (req, res, next) => {
    try {
        let { myId, name } = req.body

        if (!myId || !name) throw createError.BadRequest('Bad Request')

        console.log("createRoom: My Id ", myId)

        let newRoom = {
            owner: myId,
            name: name,
            members: []
        }

        let roomId = uuid()

        // add to meetingRooms collection
        db.collection('meetingRooms').doc(roomId).set(newRoom).then(() => {

            db.collection("users").doc(myId).get().then((data) => {

                let userData = data.data()
                if (!userData.meetingRooms) {
                    userData = {
                        ...userData,
                        meetingRooms: [roomId]
                    }
                } else {
                    userData = {
                        ...userData,
                        meetingRooms: [
                            ...userData.meetingRooms,
                            roomId
                        ]
                    }
                }
                db.collection("users").doc(myId)
                    .set(userData)
                    .then(() => {
                        res.send(newRoom)
                    }).catch((err) => {
                        next(err)
                    })
            }).catch((err) => {
                console.log(err)
            })

        }).catch((err) => {
            next(err)
        })

    } catch (err) {
        next(err)
    }
})

call.post("/myrooms", async (req,res,next)=>{
    try{

        let { myId } = req.body
        if(!myId) throw createError.BadRequest('Bad Request')

        db.collection('users').doc(myId).get().then((data)=>{
            let myRooms = data.data().meetingRooms
            res.json(myRooms)
        }).catch((err)=>{
            next(err)
        })
    } catch(err){
        next(err)
    }
})


module.exports = call
