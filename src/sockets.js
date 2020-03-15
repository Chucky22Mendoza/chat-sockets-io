const socket = {};
const Chat = require('./models/Chat');
//const { format } = require('timeago.js');

let users = [];

socket.socketConnection = (connect_io) => {
    connect_io.on('connection', async (socket) => {
        console.log('new user connected');

        var messages = await Chat.find({}).limit(8).sort('-created');


        socket.on('new user', (data, callback) => {
            if (data in users) {
                callback(false);
            } else {
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
                socket.emit('load old msgs', messages);
            }
        });

        socket.on('send message', async (data, callback) => {
            var msg = data.trim();

            if (msg.substr(0,3) === '$w ') {
                msg = msg.substr(3);
                var index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        callback('Error! Please enter a valid user');
                    }
                } else {
                    callback('Error! Please enter your message');
                }
            } else {
                let newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                connect_io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        socket.on('disconnect', data => {
            if (!socket.nickname) {
                return;
            }
            delete users[socket.nickname];
            updateNicknames();
        });

        updateNicknames = () => {
            connect_io.sockets.emit('usernames', Object.keys(users));
        }

    });
}

module.exports = socket;