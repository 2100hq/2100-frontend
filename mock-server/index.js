const Socket = require('socket.io')()

Socket.once('connection', client => {
    console.log("CONNECTION !")

    setInterval(() => {
        client.emit('update', { data: { a: 1 }})
    }, 5000);
})

Socket.listen(4000)