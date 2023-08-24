// import { Socket } from "socket.io";
// import io from Socket

// io(3001, )
// const express = require('express')
// const app = express()
// const port = 3001

// app.listen(port, ()=> {
//     console.log("express app running on port 3001")
// // })
// const http = require("http");
// const host = 'localhost';
// const port = 8000;

// ...

// const requestListener = function (req, res) {
//     res.writeHead(200);
//     res.end("My first server!");
// };

const io = require('socket.io')(8000, {
    cors: { 
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})


io.on('connection', socket => {

    socket.on('send-changes', delta => {
        console.log(delta)
        socket.broadcast.emit('receive-changes', delta)
    })

    console.log("connected") 
})
