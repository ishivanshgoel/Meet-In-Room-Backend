const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const createErrors = require('http-errors')
const { ExpressPeerServer } = require('peer');
const Emitter = require('events')

// Event emitter
const eventEmitter = new Emitter()

const cors = require('cors')
require('./setup/firebase/firebase.setup')

// Routes
const call = require('./views/call/call.view.js')
const auth = require('./views/auth/auth.view.js')


app.set('eventEmitter', eventEmitter)
app.use(cors())
app.use(bodyparser())

app.use('/auth', auth)
app.use('/call', call)

app.get('/', (req,res,next)=>{
    res.send('Working')
})

// not found route
app.use(async (req, res, next)=>{
    next(createErrors.NotFound())
})

// error handler
app.use((err, req, res, next)=>{
    console.log(err)
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 5000

const server = app.listen((PORT), ()=>{
    console.log('Server Running at port 5000')
})

const peerServer = ExpressPeerServer(server, {
    debug: true,
    allow_discovery: true
  });

  
app.use('/peerjs', peerServer);

//////////// socket server ////////////////////////

const io = require('socket.io')(server, {

    // io.sockets.adapter.rooms to get all the rooms

    cors: {
      origin: '*',
    }
})

let socketGlobal

io.on('connection', (socket)=>{

    socketGlobal=socket

    // join the user
    socket.on('join', (userid)=>{
        console.log('User Joining id: ', userid)
        socket.join(userid)
    })


    // emit accepted offer to sender
    socket.on('accepted-call-offer', (data)=>{
        console.log('Call Accepted', data)
        io.to(data.sender).emit('call-offer-accepted', data)
        // io.to(data.roomId).broadcast.emit('user-connected', data.receiver)
    })

    // emit rejected offer to sender
    socket.on('rejected-call-offer', (data)=>{
        console.log('Rejected Call ', data)
        io.to(data.sender).emit('call-offer-rejected', data)
    })

    // joining room
    socket.on('join-room', (roomId, userId) => {
        console.log("Room Joined ", roomId)
        console.log("Room joined by user ", userId)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    
        socket.on('disconnect', () => {
          socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

})

/////////////// event listners ////////////////////
eventEmitter.on('send-call-offer', (data)=>{
    // socketGlobal.join(data.roomId)
    // emitting event to reciever
    // console.log(data)
    io.to(data.receiver).emit('receive-call-offer', data)

})



