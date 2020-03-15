const socket = io();
//Getting DOM elements from interface
const messageForm = document.querySelector('#message-form');
const messageBox = document.querySelector('#message');
const chat = document.querySelector('#chat');
const contentWrap = document.querySelector('#contentWrap');

//Getting DOM elements from nickname form
const nickWrap = document.querySelector('#nickWrap');
const nickform = document.querySelector('#nickForm');
const nickerror = document.querySelector('#nickError');
const nickname = document.querySelector('#nickname');

const users = document.querySelector('#usernames');

// events interface
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    let newMessage = messageBox.value;
    socket.emit('send message', newMessage, data => {
        let output_msg = document.createElement('div');
        output_msg.className = 'error';
        let output_nick = document.createElement('strong');
        output_nick.textContent = data;
        output_msg.appendChild(output_nick);
        chat.appendChild(output_msg);
    });
    messageBox.value = '';
});

socket.on('new message', data => {
    let output_msg = document.createElement('div');
    let output_nick = document.createElement('strong');
    output_nick.textContent = data.nick.toUpperCase() + ': ';
    output_msg.appendChild(output_nick);
    output_msg.textContent += data.msg;
    chat.appendChild(output_msg);
});

//events nickname
nickform.addEventListener('submit', e => {
    e.preventDefault();
    let newUser = nickname.value;
    if(newUser.length > 0){
        socket.emit('new user', newUser, data => {
            if (data) {
                nickWrap.style.display = 'none';
                contentWrap.style.display ='flex';
            } else {
                nickerror.innerHTML = '<div class="alert alert-danger">That username already exists</div>'
            }
        });
        nickname.value = ''
    }else{
        nickerror.innerHTML = '<div class="alert alert-danger">Please write a user</div>'
    }
});

socket.on('usernames', data => {

    users.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        let output_p = document.createElement('h5');
        let output_i = document.createElement('i');
        output_i.className = 'fa fa-user';
        output_i.textContent = ' ' + data[i].toUpperCase();
        output_p.appendChild(output_i);
        users.appendChild(output_p);
    }

});

socket.on('whisper', data => {
    displayMsg(data);
});

socket.on('load old msgs', (msgs) => {
    for (let i=msgs.length-1; i > 0; i--) {
        displayMsg(msgs[i]);
    }
});

displayMsg = (data) => {
    let output_msg = document.createElement('div');
    output_msg.className = 'whisper row col-md-12';
    let output_nick = document.createElement('strong');
    output_nick.textContent = data.nick.toUpperCase() + ': ';
    //let output_timeago = document.createElement('b');
    //output_timeago.textContent = jQuery.timeago(data.created);
    //output_timeago.className = 'time-ago';
    output_msg.appendChild(output_nick);
    output_msg.textContent += data.msg;
    //output_msg.appendChild(output_timeago);
    chat.appendChild(output_msg);
}