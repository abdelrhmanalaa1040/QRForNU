const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); 

let activeLink = null; 

io.on('connection', (socket) => {
    console.log('A user connected');

    if (activeLink) {
        socket.emit('newQrLink', activeLink);
    }

    socket.on('qrScanned', (data) => {
        activeLink = data;
        io.emit('newQrLink', data); 

        setTimeout(() => {
            activeLink = null;
            io.emit('clearLink'); 
        }, 60000); 
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
