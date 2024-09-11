import mongoose from "mongoose"

// const password = encodeURIComponent(process.env.MONGO_PASSWORD.trim()) 
const password = "PepperCorn994"
const uri = `mongodb+srv://augustwiesner16:PepperCorn994@junipercluster0.09ygd.mongodb.net/?retryWrites=true&w=majority&appName=JuniperCluster0`;

async function connect() {
	try {
		await mongoose.connect(uri)
		console.log(`MongoDB connected`)
	} catch (err) {
		console.error(err)
	}
}

export default connect