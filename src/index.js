const express = require('express');
const path = require('path');
const morgan = require('morgan');
const socketio = require('socket.io');
const http = require('http');
const { socketConnection } = require('./sockets');

const app = express();
const server = http.createServer(app);
const connect_io = socketio.listen(server);

//DB
require('./database');

//settings
app.set('port', process.env.PORT || 4000);

socketConnection(connect_io);

//middlewares
app.use(morgan('dev'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

// starting server
server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});