// Node Server which will handle socket io connections
const io = require('socket.io')(8000,{
    cors:{
        origin:'*',
    }
});
 
const users = {};
const rooms = {};

io.on('connection', socket=>{
     // if any new users joins,let other users connected to the server know!
     socket.on('new-user-joined', (name,room)=>{
        socket.join(room);
        console.log("New User");
        console.log("Name :",name," Room :",room);
        users[socket.id] = name;
        rooms[socket.id] = room;
        socket.broadcast.in(room).emit('user-joined', name);
    });

     // if someone sends a message,broadcast it to other people
     socket.on('send', message=>{
        socket.broadcast.in(rooms[socket.id]).emit('receive', {message: message, name: users[socket.id]})
    });

    // if someone leaves the chat,let others know
    socket.on('disconnect', ()=>{
       socket.broadcast.in(rooms[socket.id]).emit('left', users[socket.id]);
       delete users[socket.id];
   });
 })