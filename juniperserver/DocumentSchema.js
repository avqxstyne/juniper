import { Schema, model } from "mongoose";

const Document = new Schema({
    _id: String,
    data: Object,
    name: String,
})

const docModel = model("Document", Document)

export default docModel