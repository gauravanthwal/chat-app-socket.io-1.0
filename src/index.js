const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage} = require("./utils/messages");4
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

const app = express()
const port = process.env.PORT || 3000;
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, '../public')))


io.on('connection',(socket)=>{
    console.log('new web socket connection found!');

    socket.on("join", ({username, room}, callback) => {

        const { error, user } = addUser({id: socket.id, username, room})

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit("message", generateMessage( 'Admin',`Welcome!`));
        socket.broadcast.to(user.room).emit("message",generateMessage( 'Admin',`${user.username} has joined!`));

        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)
        })
        
    }); 

   socket.on('sendMessage',(message, callback)=>{
       const user = getUser(socket.id)
       io.to(user.room).emit('message', generateMessage( user.username, message))
       callback('Delivered!')
   })

   
    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit("message", generateMessage('Admin' ,`${user.username} has left!`));

            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    });   



  
})



server.listen(port, ()=>{
    console.log('server is up on the port ' + port);
})