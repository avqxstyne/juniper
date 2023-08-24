import connect from './database.mjs'
import { Server } from "socket.io";
import mongoose from 'mongoose';
import docModel from './DocumentSchema.js';

const defaultValue = ''
const io = new Server(8000, {
    cors: { 
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

connect();





io.on('connection', socket => {
    console.log("connected") 


    socket.on('get-document', async documentId => {
        // load document from database
        socket.join(documentId)

        const document = await generateDocument(documentId)
        socket.emit("load-document", document.data)
        
        socket.on('send-changes', delta => {
            console.log('send-changes called')
            socket.broadcast.to(documentId).emit('receive-changes', delta)
        })
        socket.on('save-document', async data => {
            console.log('save called')
            await docModel.findByIdAndUpdate(documentId, {data})
        })
    })

   

})


const generateDocument = async (id) => {
    if (id == null) return

    const doc = await docModel.findById(id);
    if (doc) {
        console.log('findbyid called')

        return doc;
    }
    else {
        console.log('create called')

        return await docModel.create({ _id: id, data: defaultValue})
    }

}