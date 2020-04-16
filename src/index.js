const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.emit('message', message)
        callback(); //ack
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}`);
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left!')
    })
})

server.listen(port, () => { console.log(`Server listening on port ${port}`) })