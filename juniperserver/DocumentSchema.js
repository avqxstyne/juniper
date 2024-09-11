import { Schema, model } from "mongoose";

const Document = new Schema({ 
    _id: String,
    data: Object,
    name: String,
    author: String,
    lastOpened: Date
})

const User = new Schema({
    email: String,
    username: String,
    password: String,
})

export const docModel = model("Document", Document)
export const userModel = model("User", User)

// export default {docModel, userModel}