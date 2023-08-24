import mongoose from "mongoose"

const MONGODB = "mongodb://127.0.0.1:27017/juniperdb";

async function connect() {
	try {
		await mongoose.connect(MONGODB)
		console.log(`MongoDB connected`)
	} catch (err) {
		console.error(err)
	}
}

export default connect