const socket=io('http://localhost:9000');

// Get DOM elements in rspective JS variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');

// Audio that will play on receiving messages
var audio=new Audio('tone.mp3');
 
// function which will append info to the container
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.innerText=message;
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
}

// Ask new users for his/her name and let the server know
const name=prompt("Enter your name to join the chat");
const room=prompt("Enter Room id to join the chat");

socket.emit('new-user-joined', name, room);

// If a new user joins, receive his\her name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})

// If server sends a message, receive it
socket.on('receive',data=>{
    append(`${data.name}: ${data.message} `,'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left',name=>{
    append(`${name} left the chat`,'right')
})


