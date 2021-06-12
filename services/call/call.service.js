// place a new call
module.exports = (io) => {
    io.on('connection', function (socket, sender, reciever) {
        socket.on('place-call', function () {
            console.log('placing new call between send and reciever ', sender);
        });


    });
}
