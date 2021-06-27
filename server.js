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
const work = require('./views/work/work.view.js')
const auth = require('./views/auth/auth.view.js')


app.set('eventEmitter', eventEmitter)
app.use(cors())
app.use(bodyparser())

app.use('/auth', auth)
app.use('/call', call)
app.use('/work', work)

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

    cors: {
      origin: '*',
    }
})

io.on('connection', (socket)=>{

    // join the user
    socket.on('join-room', ({roomId, userId})=>{
        console.log('room id ', roomId)
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('new-user-connect', userId)
        socket.on('send-message', ({ from, message})=>{
            console.log("Message ", message)
            socket.broadcast.to(roomId).emit('new-message', {from, message})
        })
        socket.on('disconnect', () => {
            console.log("User Disconnected ", userId)
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        });
    })

})

