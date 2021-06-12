const express = require('express')
const app = express()
const Emitter = require('events')

// Event emitter
const eventEmitter = new Emitter()

const cors = require('cors')
const call = require('./views/call/call.view.js')

app.set('eventEmitter', eventEmitter)
app.use(cors())
app.use('/call', call)

app.get('/', (req,res,next)=>{
    res.send('Working')
})


const server = app.listen((5000), ()=>{
    console.log('Server Running at port 5000')
})


//////////// socket server ////////////////////////

const io = require('socket.io')(server, {

    // io.sockets.adapter.rooms to get all the rooms

    cors: {
      origin: '*',
    }
})


io.on('connection', (socket)=>{

    // join the user
    socket.on('join', (userid)=>{
        console.log('User Joining id: ', userid)
        socket.join(userid)
    })


    // emit accepted offer to sender
    socket.on('accepted-call-offer', (data)=>{
        console.log('Call Accepted', data)
        io.to(data.sender).emit('call-offer-accepted', data)
    })

    // emit rejected offer to sender
    socket.on('rejected-call-offer', (data)=>{
        console.log('Rejected Call ', data)
        io.to(data.sender).emit('call-offer-rejected', data)
    })


})


/////////////// event listners ////////////////////
eventEmitter.on('send-call-offer', (data)=>{

    // emitting event to reciever
    io.to(data.receiver).emit('receive-call-offer', data)

})
