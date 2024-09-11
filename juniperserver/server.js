import connect from './database.mjs'
import { Server } from "socket.io";
import mongoose from 'mongoose';
import { docModel, userModel } from './DocumentSchema.js';
import secret from './config/auth.config.js';
import jwtPkg from 'jsonwebtoken';
const { sign } = jwtPkg;
import bcryptPkg from 'bcryptjs';
const { hashSync, compareSync } = bcryptPkg;

import express from 'express';

const expressApp = express();

// EXPRESS APP CREATION __________________________
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
console.log("Express connected")
expressApp.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
    next();
});
// EXPRESS APP CREATION __________________________




// set port, listen for requests
const PORT = process.env.PORT || 8080;
expressApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
  
expressApp.get("/test", (req, res) => {
    res.send("yooooooooooooooooooooooo")
})
 

expressApp.post("/api/auth/signup", async (req, res) => {
    const allUsers = await userModel.find({})
    let newUser = true;
    res.header({
        'Access-Control-Allow-Origin': '*'
    })

    // Get all users into an array of objects
    const userData = [];
    for (let i = 0; i < allUsers.length; i++) {
        userData.push({
            email: allUsers[i].email, 
            username: allUsers[i].username,
            password: allUsers[i].password
        })
    }

    // Check if param information exists in the array of users
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].email == req.body.email) {
            res.send({
                text: "Operation unsuccessful: Email in use.",
                new_window: "false"
            })
            console.log("Operation unsuccessful: Email in use.")
            newUser = false;
            return res.status(200).send();
        }
        if (userData[i].username == req.body.username) {
            res.send({
                text: "Operation unsuccessful: Username in use.",
                new_window: "false"
            })
            console.log("Operation unsuccessful: Username in use.")
            newUser = false;
            return res.status(200).send();
        }
    };

    // Create a new user if none of this fails
    if (newUser == true) {
        userModel.create({
            email: req.body.email,
            username: req.body.username,
            password: hashSync(req.body.password, 8)
        })
        
        res.send({
            text: "Operation successful: User created.",
            new_window: "true",
            username: req.body.username
        })
        return res.status(200).send();
    }
})
expressApp.post("/api/auth/signin", async (req, res) => {
    const allUsers = await userModel.find({})
    res.header({
        'Access-Control-Allow-Origin': '*'
    })
    let user;

    // Get all users into an array of objects
    const userData = [];
    for (let i = 0; i < allUsers.length; i++) {
        userData.push({
            email: allUsers[i].email, 
            username: allUsers[i].username,
            password: allUsers[i].password
        })
    }
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].username == req.body.username) {
            user = userData[i]
        }
    }
    
    console.log(user.password)
    if (!user) {
        return res.status(404).send({ 
            message: "User Not found.",
            new_window: "false" 
        });
    }

    var passwordIsValid = compareSync(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
        new_window: "false"
        });
    }

    const token = sign(
        { 
            id: user.id 
        },
        secret,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        }
    );

      
    res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token,
        new_window: "true"

    });
    
});

// _______________ SOCKET SERVER CREATION_______________________________________________________________________________
const defaultValue = ''
const io = new Server(8000, {
    cors: { 
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, 
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
// _______________ SOCKET SERVER CREATION_______________________________________________________________________________

connect(); // mongo?

// ____ SOCKET SERVER OPERATION_______________________________________________________________________________

io.on('connection', socket => {
    console.log("connected") 

    socket.on('get-document', async (documentId, currentLogin) => {
        // load document from database
        socket.join(documentId)
        const document = await generateDocument(documentId, currentLogin)
        socket.emit("load-document", {
            data: document.data,
            name: document.name
        })
        
        socket.on('send-changes', delta => {
            console.log('send-changes called')
            socket.broadcast.to(documentId).emit('receive-changes', delta)
        })
        socket.on('save-document', async (data, name, lastOpened) => {
            console.log("red")
            await docModel.findByIdAndUpdate(documentId, {data, name, lastOpened})
        })
        socket.on('delete-document', async (data, name, lastOpened) => {
            console.log("Were in the delete socket")
    
            await docModel.findByIdAndDelete(documentId)
            socket.emit("send-it-back", "yaur")
        })
    });



    socket.on('get-all', async (currentLogin) => {
        const allDocuments = await docModel.find({author: currentLogin});
        const data = []
        for (let i = 0; i < allDocuments.length; i++) {
            data.push({
                id: allDocuments[i]._id, 
                name: allDocuments[i].name,
                lastOpened: allDocuments[i].lastOpened 
            })
        }
        console.log(data)
        socket.emit("display-all", data)
    })
})


const generateDocument = async (id, currentLogin) => {
    if (id == null) return

    const doc = await docModel.findById(id);
    if (doc) {
        console.log('findbyid called')

        return doc;
    }
    else {
        console.log('create called')

        return await docModel.create({ _id: id, data: defaultValue, name: "Untitled Document", author: currentLogin, lastOpened: Date.now()})
    }

}