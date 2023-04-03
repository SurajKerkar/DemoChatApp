const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;

app.use(express.static('public'));

const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});